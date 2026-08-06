param(
    [string]$JsonPath = "$PSScriptRoot\..\src\data\awwwards-references.json",
    [string]$ReportPath = "$PSScriptRoot\..\research\awwwards-100.md"
)

$ErrorActionPreference = 'Stop'
$categories = @(
    @{ id = 'gsap'; url = 'https://www.awwwards.com/websites/gsap-animation/'; pattern = 'Coreografia temporal con GSAP, continuidad entre estados y movimiento reducido.' },
    @{ id = 'webgl'; url = 'https://www.awwwards.com/websites/webgl/'; pattern = 'Escena espacial WebGL con contenido equivalente y control de rendimiento.' },
    @{ id = 'experimental'; url = 'https://www.awwwards.com/websites/experimental/'; pattern = 'Navegacion no lineal que conserva orientacion, teclado y salida clara.' },
    @{ id = 'music'; url = 'https://www.awwwards.com/websites/music-sound/'; pattern = 'Sonido opcional con transporte visible, contexto y silencio por defecto.' },
    @{ id = 'art'; url = 'https://www.awwwards.com/websites/art-illustration/'; pattern = 'Direccion de arte editorial donde la obra sigue siendo el primer plano.' }
)

$seen = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$items = [System.Collections.Generic.List[object]]::new()

foreach ($category in $categories) {
    $response = Invoke-WebRequest -Uri $category.url -Headers @{ 'User-Agent' = 'Mozilla/5.0 BELENTANI research index' } -TimeoutSec 45
    $matches = [regex]::Matches($response.Content, 'href=["''](?<path>/sites/[a-zA-Z0-9][^"''?#< ]+)')
    foreach ($match in $matches) {
        $path = $match.Groups['path'].Value.TrimEnd('/')
        $url = "https://www.awwwards.com$path"
        if (-not $seen.Add($url)) { continue }
        $slug = $path.Substring('/sites/'.Length)
        $title = (([uri]::UnescapeDataString($slug) -replace '[-_]+', ' ') -replace '\s+', ' ').Trim()
        $items.Add([pscustomobject]@{
            id = "awwwards-$($items.Count + 1)"
            source = 'Awwwards'
            url = $url
            title = (Get-Culture).TextInfo.ToTitleCase($title)
            category = $category.id
            pattern = $category.pattern
            caution = 'Referencia de investigacion. Reutilizar principios, no composicion, codigo, texto ni activos.'
        })
        if ($items.Count -eq 100) { break }
    }
    if ($items.Count -eq 100) { break }
}

if ($items.Count -lt 100) { throw "Solo se obtuvieron $($items.Count) sitios Awwwards distintos" }

$jsonParent = Split-Path -Parent $JsonPath
$reportParent = Split-Path -Parent $ReportPath
New-Item -ItemType Directory -Force -Path $jsonParent,$reportParent | Out-Null
$items | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $JsonPath -Encoding utf8

$lines = @(
    '# Awwwards 100',
    '',
    "Generado: $((Get-Date).ToString('o'))",
    '',
    '100 fichas distintas obtenidas de listados oficiales. Catalogo de investigacion; no ranking universal.',
    ''
)
foreach ($item in $items) { $lines += "- [$($item.title)]($($item.url)) - $($item.category)" }
$lines | Set-Content -LiteralPath $ReportPath -Encoding utf8

[pscustomobject]@{ count = $items.Count; uniqueUrls = $seen.Count; json = $JsonPath; report = $ReportPath } | ConvertTo-Json
