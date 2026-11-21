param(
  [Parameter(Mandatory = $true)]
  [string]$ManifestPath,
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\src\data\html-atlas.generated.json')
)

$manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
$sensitivePattern = 'instagram|followers|following|close_friends|follow_requests|takeout|password|token|credential|medical|psicolog|schiz|diagnos|curriculum|\bcv\b|linkedin|gmail|personal access|private-corpus\\phone'
$corePattern = 'belentani|judas|omega|buildai|noiacore|zion|oraculo|oráculo'
$technicalPattern = 'three(\.js)?|animation(action|clip|mixer)|buffergeometry|material|renderer|texture|tabler-icons'
$referencePattern = 'awwwards|dogstudio|dragonfly|active theory|dojacode|xbox museum|the field|nurture|ambush'

$records = for ($index = 0; $index -lt $manifest.files.Count; $index += 1) {
  $file = $manifest.files[$index]
  $searchable = (($file.fuentes + $file.archivo_recuperado) -join ' ').ToLowerInvariant()
  $names = ($file.fuentes | ForEach-Object { Split-Path -Leaf $_ }) -join ' '
  $names = $names.ToLowerInvariant()
  $privacy = if ($searchable -match $sensitivePattern) { 'private' } else { 'review' }
  $relation = if ($names -match $technicalPattern) {
    'technical'
  } elseif ($names -match $referencePattern) {
    'reference'
  } elseif ($names -match $corePattern) {
    'core'
  } else {
    'external'
  }

  [ordered]@{
    id = ('html-{0:D4}' -f ($index + 1))
    digest = $file.sha256.Substring(0, 12)
    bytes = [long]$file.bytes
    structured = [bool]$file.parece_html
    relation = $relation
    visibility = $privacy
  }
}

$payload = [ordered]@{
  generatedAt = (Get-Date).ToString('yyyy-MM-dd')
  source = 'sanitized local recovery manifest'
  uniqueFiles = [long]$manifest.unique_files
  sourceInstances = [long]$manifest.source_instances
  records = $records
}

$parent = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Path $parent -Force | Out-Null
$payload | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $OutputPath -Encoding utf8
