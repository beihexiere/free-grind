# Generate iOS AppIcon PNGs from app-icon-source.png
# Run from repo root: pwsh scripts/gen-ios-icons.ps1

Add-Type -AssemblyName System.Drawing

$source = "src-tauri/icons/app-icon-source.png"
$destDir = "src-tauri/gen/apple/Assets.xcassets/AppIcon.appiconset"

if (-not (Test-Path $source)) { Write-Error "Source not found: $source"; exit 1 }
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

$srcImg = [System.Drawing.Image]::FromFile((Resolve-Path $source))
Write-Output "Source: $source ($($srcImg.Width)x$($srcImg.Height))"

# iOS AppIcon required sizes: name -> pixel size
$sizes = @{
	"AppIcon-20x20@1x"  = 20
	"AppIcon-20x20@2x"  = 40
	"AppIcon-20x20@2x-1"= 40   # duplicate, existing project has it
	"AppIcon-20x20@3x"  = 60
	"AppIcon-29x29@1x"  = 29
	"AppIcon-29x29@2x"  = 58
	"AppIcon-29x29@2x-1"= 58
	"AppIcon-29x29@3x"  = 87
	"AppIcon-40x40@1x"  = 40
	"AppIcon-40x40@2x"  = 80
	"AppIcon-40x40@2x-1"= 80
	"AppIcon-40x40@3x"  = 120
	"AppIcon-512@2x"    = 1024
	"AppIcon-60x60@2x"  = 120
	"AppIcon-60x60@3x"  = 180
	"AppIcon-76x76@1x"  = 76
	"AppIcon-76x76@2x"  = 152
	"AppIcon-83.5x83.5@2x" = 167
}

$count = 0
foreach ($name in $sizes.Keys) {
	$px = $sizes[$name]
	$dest = Join-Path $destDir "$name.png"
	$bmp = New-Object System.Drawing.Bitmap($px, $px)
	$gfx = [System.Drawing.Graphics]::FromImage($bmp)
	$gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
	$gfx.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
	$gfx.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
	$gfx.CompositingQuality= [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
	$gfx.DrawImage($srcImg, 0, 0, $px, $px)
	$bmp.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
	$gfx.Dispose(); $bmp.Dispose()
	$count++
}
$srcImg.Dispose()
Write-Output "Generated $count PNGs in $destDir"
