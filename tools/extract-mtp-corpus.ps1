param(
    [string]$DeviceName = 'HUAWEI P30 Pro',
    [string]$StorageName = 'Memoria interna',
    [string]$SelectionPath = "$PSScriptRoot\..\research\mobile-selection.json",
    [string]$Destination = "$PSScriptRoot\..\research\private-corpus\phone",
    [int]$Limit = 0
)

$ErrorActionPreference = 'Stop'
$selection = Get-Content -LiteralPath $SelectionPath -Raw | ConvertFrom-Json
$selected = @($selection.files)
if ($Limit -gt 0) { $selected = @($selected | Select-Object -First $Limit) }

$wanted = @{}
foreach ($file in $selected) { $wanted[[string]$file.relativePath] = $file }
$pendingPrefixes = @($wanted.Keys | ForEach-Object { ($_ -split '/')[0] } | Sort-Object -Unique)

$shell = New-Object -ComObject Shell.Application
$device = $shell.Namespace(17).Items() | Where-Object Name -eq $DeviceName
if (-not $device) { throw "Dispositivo no encontrado: $DeviceName" }
$storage = $device.GetFolder.Items() | Where-Object Name -eq $StorageName
if (-not $storage) { throw "Almacenamiento no encontrado: $StorageName" }

New-Item -ItemType Directory -Force -Path $Destination | Out-Null
$Destination = (Resolve-Path -LiteralPath $Destination).Path
$logPath = Join-Path $Destination '_extraction-log.jsonl'
$queue = [System.Collections.Generic.Queue[object]]::new()
foreach ($rootName in $pendingPrefixes) {
    $root = $storage.GetFolder.Items() | Where-Object Name -eq $rootName
    if ($root) { $queue.Enqueue([pscustomobject]@{ Item = $root; Relative = $rootName }) }
}

$copied = 0
$skipped = 0
$failed = 0
$copiedBytes = 0L

function Write-Log([string]$Status, [string]$Path, [string]$Message = '') {
    [pscustomobject]@{
        at = (Get-Date).ToString('o')
        status = $Status
        path = $Path
        message = $Message
    } | ConvertTo-Json -Compress | Add-Content -LiteralPath $logPath -Encoding utf8
}

while ($queue.Count -gt 0 -and $wanted.Count -gt 0) {
    $node = $queue.Dequeue()
    try { $children = @($node.Item.GetFolder.Items()) } catch {
        Write-Log 'folder-error' $node.Relative $_.Exception.Message
        $failed++
        continue
    }

    foreach ($child in $children) {
        $relative = "$($node.Relative)/$($child.Name)"
        if ($child.IsFolder) {
            $prefix = "$relative/"
            if (@($wanted.Keys | Where-Object { $_.StartsWith($prefix, [StringComparison]::OrdinalIgnoreCase) }).Count -gt 0) {
                $queue.Enqueue([pscustomobject]@{ Item = $child; Relative = $relative })
            }
            continue
        }

        if (-not $wanted.ContainsKey($relative)) { continue }
        $meta = $wanted[$relative]
        $segments = $relative -split '/'
        $safeSegments = foreach ($segment in $segments[0..($segments.Count - 2)]) {
            $safe = $segment
            foreach ($invalid in [IO.Path]::GetInvalidFileNameChars()) { $safe = $safe.Replace([string]$invalid, '_') }
            $safe.TrimEnd('.', ' ')
        }
        $targetDir = Join-Path $Destination ($safeSegments -join [IO.Path]::DirectorySeparatorChar)
        New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
        $targetFile = Join-Path $targetDir $child.Name

        if (Test-Path -LiteralPath $targetFile) {
            $existing = Get-Item -LiteralPath $targetFile
            if ($existing.Length -eq [long]$meta.size) {
                Write-Log 'existing' $relative "$($existing.Length)"
                $skipped++
                $wanted.Remove($relative)
                continue
            }
        }

        try {
            $destinationFolder = $shell.Namespace($targetDir)
            if (-not $destinationFolder) { throw "Destino Shell no disponible: $targetDir" }
            $destinationFolder.CopyHere($child, 1556)

            $deadline = (Get-Date).AddSeconds([math]::Max(90, [math]::Min(1800, ([long]$meta.size / 1MB) * 8 + 60)))
            do {
                Start-Sleep -Milliseconds 750
                $ready = Test-Path -LiteralPath $targetFile
                if ($ready) { $actual = (Get-Item -LiteralPath $targetFile).Length }
            } while ((-not $ready -or $actual -ne [long]$meta.size) -and (Get-Date) -lt $deadline)

            if (-not $ready -or $actual -ne [long]$meta.size) {
                throw "Tamaño incompleto: esperado=$($meta.size) actual=$actual"
            }

            Write-Log 'copied' $relative "$actual"
            $copied++
            $copiedBytes += $actual
            $wanted.Remove($relative)
            Write-Host "COPY $copied/$($selected.Count) $relative"
        } catch {
            Write-Log 'copy-error' $relative $_.Exception.Message
            $failed++
            $wanted.Remove($relative)
        }
    }
}

foreach ($missing in $wanted.Keys) { Write-Log 'not-found' $missing; $failed++ }

[pscustomobject]@{
    selected = $selected.Count
    copied = $copied
    existing = $skipped
    failed = $failed
    copiedBytes = $copiedBytes
    destination = (Resolve-Path $Destination).Path
    log = $logPath
} | ConvertTo-Json
