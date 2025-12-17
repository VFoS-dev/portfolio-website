# Format all files using Prettier
$files = Get-ChildItem -Path "src" -Recurse -Include *.vue,*.js,*.jsx,*.cjs,*.mjs,*.json,*.css,*.less

foreach ($file in $files) {
    Write-Host "Formatting: $($file.FullName)"
    npx prettier --write $file.FullName --config .prettierrc
}

Write-Host "Formatting complete!"

