function menuBar() {
    SpreadsheetApp.getUi().createMenu("Search-Jobs")
    .addItem("Indeed.com", "initiate")
    .addToUi();
}
