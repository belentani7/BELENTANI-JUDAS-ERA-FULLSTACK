param(
    [string]$DeviceName = 'HUAWEI P30 Pro',
    [string]$StorageName = 'Memoria interna',
    [string]$OutputPath = "$PSScriptRoot\..\research\mobile-index.json",
    [string[]]$Roots = @('Download', 'Descargas 2026', 'Documents', 'Pictures', 'audios', 'Movies', 'Music'),
    [string]$SkipFolderPattern = '(?i)^(\.thumbnails|\.Gallery2|\.gs|WhatsApp|Telegram|takeout-.*|Android)$'
)

$ErrorActionPreference = 'Stop'
$shell = New-Object -ComObject Shell.Application
$device = $shell.Namespace(17).Items() | Where-Object Name -eq $DeviceName
if (-not $device) { throw "Dispositivo no encontrado: $DeviceName" }

$storage = $device.GetFolder.Items() | Where-Object Name -eq $StorageName
if (-not $storage) { throw "Almacenamiento no encontrado: $StorageName" }

$projectPattern = '(?i)belentani|judas|omega|noia|prisma|duck|manos|web|html|css|javascript|typescript|react|next|vite|qwen|prompt|agente|agent|album|music|audio|demo|studio|portfolio|curso|biblioteca|rights|derechos|cv|arte|art|design|video|film|libro|book'
$privatePattern = '(?i)whatsapp|contact|vcf|padron|laboral|demanda|justicia|hipoteca|proteccion|diagnostico|informe|medical|salud|banco|payment|solicitudes de dinero'
$records = [System.Collections.Generic.List[object]]::new()
$errors = [System.Collections.Generic.List[object]]::new()
$queue = [System.Collections.Generic.Queue[object]]::new()
$foldersScanned = 0

foreach ($rootName in $Roots) {
    $root = $storage.GetFolder.Items() | Where-Object Name -eq $rootName
    if ($root) {
        $queue.Enqueue([pscustomobject]@{ Item = $root; Relative = $rootName })
    }
}

while ($queue.Count -gt 0) {
    $node = $queue.Dequeue()
    try {
        $children = @($node.Item.GetFolder.Items())
    } catch {
        $errors.Add([pscustomobject]@{ relativePath = $node.Relative; error = $_.Exception.Message })
        continue
    }
    $foldersScanned++
    if ($foldersScanned % 25 -eq 0) {
        Write-Host "INDEX folders=$foldersScanned files=$($records.Count) queue=$($queue.Count)"
    }
    foreach ($child in $children) {
        $relative = "$($node.Relative)/$($child.Name)"
        if ($child.IsFolder) {
            if ($child.Name -match $SkipFolderPattern) {
                $errors.Add([pscustomobject]@{ relativePath = $relative; error = 'SKIPPED_BY_POLICY' })
                continue
            }
            $queue.Enqueue([pscustomobject]@{ Item = $child; Relative = $relative })
            continue
        }

        $extension = [IO.Path]::GetExtension($child.Name).ToLowerInvariant()
        $category = if ($relative -match $privatePattern) {
            'private'
        } elseif ($relative -match $projectPattern -or $extension -in @('.html','.htm','.css','.js','.mjs','.cjs','.ts','.tsx','.jsx','.md','.json','.yaml','.yml','.svg','.glsl','.vert','.frag','.blend','.gltf','.glb','.wav','.mp3','.flac','.m4a','.ogg','.opus','.mid','.midi','.mp4','.mov','.webm','.png','.jpg','.jpeg','.webp','.gif','.avif','.docx','.pptx','.xlsx')) {
            'candidate'
        } else {
            'other'
        }

        $records.Add([pscustomobject]@{
            relativePath = $relative
            name = $child.Name
            extension = $extension
            category = $category
            size = $child.ExtendedProperty('System.Size')
            modified = $child.ModifyDate
            sourcePath = $child.Path
        })
    }
}

$payload = [ordered]@{
    generatedAt = (Get-Date).ToString('o')
    device = $DeviceName
    storage = $StorageName
    roots = $Roots
    total = $records.Count
    candidate = @($records | Where-Object category -eq 'candidate').Count
    private = @($records | Where-Object category -eq 'private').Count
    other = @($records | Where-Object category -eq 'other').Count
    foldersScanned = $foldersScanned
    errors = $errors
    files = $records
}

$parent = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Force -Path $parent | Out-Null
$payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $OutputPath -Encoding utf8
[pscustomobject]@{
    generatedAt = $payload.generatedAt
    device = $payload.device
    storage = $payload.storage
    total = $payload.total
    candidate = $payload.candidate
    private = $payload.private
    other = $payload.other
    foldersScanned = $payload.foldersScanned
    errors = $payload.errors
} | ConvertTo-Json -Depth 4
