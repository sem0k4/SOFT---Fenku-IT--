# Script PowerShell pour convertir HTML en PDF
# Utilise Microsoft Edge pour la conversion

$InputFile = "Propositions_Integration_Communication_Temps_Reel_ESP32_FAJMA.html"
$OutputFile = "Propositions_Integration_Communication_Temps_Reel_ESP32_FAJMA.pdf"

Write-Host "📄 Conversion HTML vers PDF" -ForegroundColor Cyan
Write-Host "Fichier d'entrée : $InputFile" -ForegroundColor White
Write-Host "Fichier de sortie : $OutputFile" -ForegroundColor White
Write-Host ""

# Vérifier que le fichier HTML existe
if (-not (Test-Path $InputFile)) {
    Write-Host "❌ Fichier HTML non trouvé : $InputFile" -ForegroundColor Red
    exit 1
}

# Supprimer le PDF existant s'il existe
if (Test-Path $OutputFile) {
    Remove-Item $OutputFile -Force
    Write-Host "🗑️  Ancien PDF supprimé" -ForegroundColor Yellow
}

# Chercher Microsoft Edge
$EdgePaths = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
)

$EdgePath = $null
foreach ($path in $EdgePaths) {
    if (Test-Path $path) {
        $EdgePath = $path
        break
    }
}

if ($EdgePath) {
    Write-Host "🔄 Conversion avec Microsoft Edge..." -ForegroundColor Yellow
    
    $FullHtmlPath = (Resolve-Path $InputFile).Path
    $CurrentDir = Get-Location
    $FullPdfPath = Join-Path $CurrentDir $OutputFile
    
    # Arguments pour Edge
    $Arguments = @(
        "--headless"
        "--disable-gpu"
        "--run-all-compositor-stages-before-draw"
        "--virtual-time-budget=25000"
        "--print-to-pdf=`"$FullPdfPath`""
        "file:///$($FullHtmlPath.Replace('\\', '/'))"
    )
    
    try {
        Start-Process -FilePath $EdgePath -ArgumentList $Arguments -Wait -WindowStyle Hidden
        Start-Sleep -Seconds 3
        
        if (Test-Path $OutputFile) {
            Write-Host "✅ PDF créé avec succès : $OutputFile" -ForegroundColor Green
            Write-Host "📖 Ouverture du PDF..." -ForegroundColor Cyan
            Start-Process $OutputFile
        } else {
            Write-Host "❌ Échec de la création du PDF" -ForegroundColor Red
            Write-Host "🌐 Ouverture du fichier HTML dans le navigateur..." -ForegroundColor Cyan
            Start-Process $InputFile
        }
    } catch {
        Write-Host "❌ Erreur lors de la conversion : $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "🌐 Ouverture du fichier HTML dans le navigateur..." -ForegroundColor Cyan
        Start-Process $InputFile
    }
} else {
    Write-Host "❌ Microsoft Edge non trouvé" -ForegroundColor Red
    Write-Host "🌐 Ouverture du fichier HTML dans le navigateur par défaut..." -ForegroundColor Cyan
    Start-Process $InputFile
    Write-Host "💡 Utilisez Ctrl+P puis 'Enregistrer au format PDF' pour créer le PDF manuellement" -ForegroundColor Yellow
}

Write-Host "" 
Write-Host "✨ Script terminé" -ForegroundColor Green