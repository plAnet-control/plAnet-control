<#
.SYNOPSIS
    Initializes (if needed) a git repo in the current folder and pushes it to GitHub.

.DESCRIPTION
    Run this from the folder that contains index.html, style.css, script.js.
    It will:
      1. Init git if this isn't already a repo
      2. Add + commit all files
      3. Add your GitHub repo as the "origin" remote (first run only)
      4. Push to the "main" branch

    After the first successful push, go to your repo on GitHub ->
    Settings -> Pages -> set Source to "main" / "/ (root)" and save.
    Your site will be live at: https://<your-username>.github.io/<repo-name>/

.EXAMPLE
    .\deploy.ps1 -RepoUrl "https://github.com/yourusername/your-repo.git" -CommitMessage "Update site"
#>

param(
    [string]$RepoUrl = "",
    [string]$CommitMessage = "Update site"
)

# Make sure git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed or not on PATH. Install it from https://git-scm.com/downloads" -ForegroundColor Red
    exit 1
}

# Init repo if needed
if (-not (Test-Path ".git")) {
    Write-Host "No git repo found here. Initializing..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# Stage and commit
git add .
$hasChanges = git status --porcelain
if ($hasChanges) {
    git commit -m "$CommitMessage"
} else {
    Write-Host "Nothing new to commit." -ForegroundColor Yellow
}

# Set up remote if one was passed in and none exists yet
$existingRemote = git remote 2>$null
if (-not $existingRemote) {
    if (-not $RepoUrl) {
        $RepoUrl = Read-Host "Enter your GitHub repo URL (e.g. https://github.com/username/repo.git)"
    }
    git remote add origin $RepoUrl
    Write-Host "Added remote origin -> $RepoUrl" -ForegroundColor Green
}

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

Write-Host ""
Write-Host "Done. Next step: on GitHub, go to Settings > Pages, set Source to 'main' / '/ (root)'." -ForegroundColor Green
Write-Host "Your site will then be live at https://<your-username>.github.io/<repo-name>/" -ForegroundColor Green
