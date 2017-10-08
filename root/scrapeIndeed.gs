function onOpen() {
  menuBar();
}

function worksheetID() {
  return SpreadsheetApp.getActiveSpreadsheet().getId()
}

function initiate(){
  findJobs('Jobs', jobSearch);
}

function findJobs(name, userJobSearch){
  var jobSearch = parseXml(name, userJobSearch, locationArray);
  var doc = openSheet()
  var sheet = getSheet(doc, name);
  var getAvailableRow = getFreeRow(sheet);

  if (jobSearch.length){
    sheet.getRange(getAvailableRow, 1, jobSearch.length, headers.length).setValues(jobSearch);
    sheet.sort(7, false);
    sheet.sort(4, true);
  }
}

function getJobKeys(){
  var doc = openSheet();
  var sheet = getSheet(doc, 'jobkeys');
  var lastRow = getLastRow(sheet);
  Logger.log(lastRow)
  return sheet.getRange('A2:A' + lastRow).getValues();
}

function setJobKeys(array){
  var doc = openSheet();
  var sheet = getSheet(doc, 'jobkeys');
  var getAvailableRow = getFreeRow(sheet);
  sheet.getRange(getAvailableRow,1,array.length).setValues(array);
}

function parseXml(name, obj, location) {
  var url, xml, document, root, entries1, entries2, totalResults, title, jobURL, city, state, company, jobKey, array, newJobKey;
  var labels = [];
  var arrayJobKeys = [];
  var query = obj.jobTitle;
  var queryNot = obj.avoidJobs;
  var salary = obj.salary;
  var fromage = 3; //any or obj.fromage; date posted
  var x = 0;
  var timestamp = new Date();

  //return jobKeys
  var previousJobKeys = getJobKeys();

  for (q=0; q<query.length; q++) {
    for (l=0; l<location.length; l++){
        for(var page=0; page <= 500; page += 25){
          url = 'http://api.indeed.com/ads/apisearch?publisher=534170060100526&v=2&q=' + query[q] + '&as_and=&as_phr=&as_not=&as_ttl=&as_cmp=&jt=all&st=&salary=' + salary + '&radius=25&l=' + location[l] + '&fromage=' + fromage + '&start=' + page + 'limit=900&sort=&psf=advsrch';
          xml = UrlFetchApp.fetch(url).getContentText();
          document = XmlService.parse(xml);
          root = document.getRootElement();
          entries1 = document.getRootElement().getChild('results');
          entries2 = entries1.getChildren('result');
          totalResults = root.getChild('totalresults').getValue();

          for (var i = 0; i < entries2.length; i++) {
            title = entries2[i].getChild('jobtitle').getValue();
            jobURL = entries2[i].getChild('url').getValue();
            city = entries2[i].getChild('city').getText();
            state = entries2[i].getChild('state').getText();
            company = entries2[i].getChild('company').getText();
            jobKey = entries2[i].getChild('jobkey').getText();
            array = [];
            newJobKey = [];

            if ((!preventDuplicatesInQuery(labels, jobKey)) && (!preventUnwantedJobs(name, title)) && (!preventDuplicateJobkeys(previousJobKeys, jobKey))) {
              //for users tab
              array.push(title);
              array.push(jobURL);
              array.push(state);
              array.push(city);
              array.push(company);
              array.push(jobKey);
              array.push(timestamp);
              labels.push(array);

              //for job keys tab
              newJobKey.push(jobKey);
              arrayJobKeys.push(newJobKey);
            }
            x++;
         }
     }
   }
  }

  if (arrayJobKeys.length) {
    setJobKeys(arrayJobKeys);
  }
  return labels;
}

function preventUnwantedJobs(name, title){
  var checkValue;
  var unwantedTerms = jobSearch.avoidJobs;
  for (var x in unwantedTerms){
    checkValue = (title.toLowerCase().indexOf(unwantedTerms[x].toLowerCase()) != -1) ? true : false;
    if (checkValue){
      return checkValue;
    }
  }
}

function preventDuplicatesInQuery(array, key){
  var checkValue;
  for (var x in array) {
    checkValue = (array[x][5] === key) ? true : false;
    if (checkValue){
      return checkValue
    }
  }
}

function preventDuplicateJobkeys(array, key){
  var checkValue;
  for (var x in array) {
    checkValue = (array[x] == key) ? true : false;
    if (checkValue){
      return checkValue
    }
  }
}

function removeDuplicates(){
   //remove duplicates from sheets or prevent them from pasting into the sheet
}
