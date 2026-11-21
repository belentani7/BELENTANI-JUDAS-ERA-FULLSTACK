param(
    [string]$ResearchPath = "$PSScriptRoot\..\research",
    [string]$OutputPath = "$PSScriptRoot\..\research\mobile-selection.json"
)

$ErrorActionPreference = 'Stop'
$projectPattern = '(?i)belentani|judas|omega|noia|prisma|duck|manos|web|html|qwen|prompt|agent|album|demo|studio|portfolio|biblioteca|curso|arte|art|design|music|audio|film'
$audioPattern = '(?i)belentani|judas|mon amour|demo|mix|stem|vocal|instrumental|heartbeat|spaceship|power off|wind|thunder|chime|metro|glory|therapist|flutua|sleep talking|heartbreaking'
$generatedVisualPattern = '(?i)file_|gpt-image|gemini|copilot|meta ai|upscaled|adobe express|photogrid|arte|art|judas|belentani|omega|noia|prisma|duck'
$privatePattern = '(?i)whatsapp|contact|vcf|padron|laboral|demanda|justicia|hipoteca|proteccion|diagnostico|informe|medical|salud|banco|payment|miactividad|subscriberinfo|changehistory|titulo_e\.s\.o|certificado'

$codeExtensions = @('.html','.htm','.css','.js','.mjs','.cjs','.ts','.tsx','.jsx','.md','.json','.yaml','.yml','.svg','.glsl','.vert','.frag','.py','.ps1')
$documentExtensions = @('.pdf','.docx','.pptx','.xlsx','.txt')
$visualExtensions = @('.png','.jpg','.jpeg','.webp','.gif','.avif')
$audioExtensions = @('.wav','.mp3','.flac','.m4a','.ogg','.opus','.mid','.midi')
$videoExtensions = @('.mp4','.mov','.webm','.mkv')
$archiveExtensions = @('.zip','.7z','.rar')

$files = Get-ChildItem -LiteralPath $ResearchPath -Filter 'mobile-index-*.json' -File |
    Where-Object Name -ne 'mobile-selection.json' |
    ForEach-Object { (Get-Content -LiteralPath $_.FullName -Raw | ConvertFrom-Json).files } |
    Where-Object { $_.category -ne 'private' -and $_.relativePath -notmatch $privatePattern }

$ranked = foreach ($file in $files) {
    $path = [string]$file.relativePath
    $extension = [string]$file.extension
    $size = [long]$file.size
    $score = 0
    $kind = 'other'

    if ($extension -in $codeExtensions) {
        $kind = 'code'
        $score += 80
    } elseif ($extension -in $documentExtensions) {
        $kind = 'document'
        $score += 20
    } elseif ($extension -in $visualExtensions) {
        $kind = 'visual'
        $score += 20
    } elseif ($extension -in $audioExtensions) {
        $kind = 'audio'
        $score += 20
    } elseif ($extension -in $videoExtensions) {
        $kind = 'video'
        $score += 10
    } elseif ($extension -in $archiveExtensions) {
        $kind = 'archive'
        $score += 20
    }

    if ($path -match $projectPattern) { $score += 100 }
    if ($kind -eq 'audio' -and $path -match $audioPattern) { $score += 90 }
    if ($kind -eq 'visual' -and $path -match $generatedVisualPattern) { $score += 70 }
    if ($path -match '(?i)^Pictures/(Upscaled|Adobe Express|PhotoGrid|Instagram)/') { $score += 55 }
    if ($path -match '(?i)^Download/(Meta AI|Copilot Images|Pictures|arte-)') { $score += 55 }

    $maxSize = switch ($kind) {
        'code' { 25MB }
        'document' { 60MB }
        'visual' { 25MB }
        'audio' { 120MB }
        'video' { 300MB }
        'archive' { 350MB }
        default { 10MB }
    }

    if ($score -ge 70 -and $size -le $maxSize) {
        [pscustomobject]@{
            relativePath = $path
            kind = $kind
            score = $score
            size = $size
            extension = $extension
        }
    }
}

function Select-EvenSample {
    param([object[]]$Items, [int]$Limit)
    if ($Items.Count -le $Limit) { return $Items }
    $ordered = @($Items | Sort-Object relativePath)
    for ($i = 0; $i -lt $Limit; $i++) {
        $index = [math]::Round($i * ($ordered.Count - 1) / ($Limit - 1))
        $ordered[$index]
    }
}

$selection = [System.Collections.Generic.List[object]]::new()
foreach ($kind in @('code','document','archive')) {
    @($ranked | Where-Object kind -eq $kind | Sort-Object @{ Expression = 'score'; Descending = $true }, @{ Expression = 'size'; Ascending = $true }) |
        Select-Object -First 220 |
        ForEach-Object { $selection.Add($_) }
}

@($ranked | Where-Object { $_.kind -eq 'audio' -and $_.score -ge 110 } | Sort-Object @{ Expression = 'score'; Descending = $true }, @{ Expression = 'size'; Ascending = $true }) |
    Select-Object -First 180 |
    ForEach-Object { $selection.Add($_) }

@($ranked | Where-Object { $_.kind -eq 'visual' -and $_.relativePath -notmatch '^Pictures/Screenshots/' } | Sort-Object @{ Expression = 'score'; Descending = $true }, @{ Expression = 'size'; Ascending = $true }) |
    Select-Object -First 260 |
    ForEach-Object { $selection.Add($_) }

$screenshots = @($files | Where-Object {
    $_.relativePath -match '^Pictures/Screenshots/' -and
    $_.extension -in $visualExtensions -and
    [long]$_.size -le 25MB
} | ForEach-Object {
    [pscustomobject]@{ relativePath = $_.relativePath; kind = 'visual'; score = 25; size = [long]$_.size; extension = $_.extension }
})
Select-EvenSample -Items $screenshots -Limit 140 | ForEach-Object { $selection.Add($_) }

$projectVideos = @($ranked | Where-Object { $_.kind -eq 'video' -and $_.score -ge 100 } | Sort-Object @{ Expression = 'score'; Descending = $true }, @{ Expression = 'size'; Ascending = $true })
$videoPool = @($files | Where-Object {
    $_.extension -in $videoExtensions -and
    [long]$_.size -le 300MB -and
    $_.relativePath -notmatch $privatePattern
} | ForEach-Object {
    [pscustomobject]@{ relativePath = $_.relativePath; kind = 'video'; score = 25; size = [long]$_.size; extension = $_.extension }
})
$sampleVideos = @(Select-EvenSample -Items $videoPool -Limit 36)
$videoBytes = 0L
@($projectVideos + $sampleVideos) | Sort-Object relativePath -Unique | ForEach-Object {
    if ($videoBytes + [long]$_.size -le 1500MB) {
        $selection.Add($_)
        $videoBytes += [long]$_.size
    }
}

$unique = @($selection | Sort-Object relativePath -Unique)
$payload = [ordered]@{
    generatedAt = (Get-Date).ToString('o')
    total = $unique.Count
    totalBytes = [long](($unique | Measure-Object size -Sum).Sum)
    byKind = @($unique | Group-Object kind | Sort-Object Name | ForEach-Object {
        [pscustomobject]@{ kind = $_.Name; count = $_.Count; bytes = [long](($_.Group | Measure-Object size -Sum).Sum) }
    })
    files = $unique
}

$payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $OutputPath -Encoding utf8
[pscustomobject]@{ total = $payload.total; totalBytes = $payload.totalBytes; byKind = $payload.byKind } | ConvertTo-Json -Depth 5
