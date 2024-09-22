/**
 * This is javascript file for COMP-10259 Assignment 5. It has eventlisteners attached to the buttons which modify the DOM after processing the text and JSON objects from the server. 
 * Date: April 03, 2024
 * Created by: Jasanpreet Singh Sidhu, 000929247
 */


/**
 * This runs the script after html page is fully loaded
 */
window.addEventListener("load", function () {
    
    // getting Button nodes to add event listeners
    let headerButton = this.document.getElementById("headerButton");
    let imagesButton = this.document.getElementById("imagesButton");
    let tableButton = this.document.getElementById("tableButton");

    
    // adding event listeners
    headerButton.addEventListener("click", showHeading);
    imagesButton.addEventListener("click", () => { 
        showImages(); 
        disableOtherInput();
    });
    tableButton.addEventListener("click",() => { 
        addTable();
        disableOtherInput();
    });

    // link to the file on the server
    let url = "https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php";

                                        
    
    /********************************** Header Button Event Listeners *******************************************************/
    
    /**
     * event listener function for the header button. It sends the get request and extracts the text from the response
     * @param {event} event to which this function is attached  
     */
    function showHeading(event) {
        console.log(url); // debug
        fetch(url, { credentials: 'include' })
            .then(response => response.text())
            .then((text) => { createH1(text);  });
    }

    
    // creating h1 tag
    let heading = document.createElement("h1");
    // add created element to the document
    document.body.appendChild(heading);
    // adds whitespace in the h1 tag
    heading.innerText = "\n\n";
    
    
    /**
     * It adds response text along with give student ID string to the h1 tag
     * @param {Text} text response from the php file 
     */
    function createH1(text) {
        console.log(text);
        let h1 = document.querySelector("h1");
        let h1_text = "Select the franchise & Click Buttons to get their Info";		//let h1_text = text + " - Student # 000929247";
        // adds text in the h1 tag
        heading.innerText = h1_text;


        //styling h1
        heading.classList.add("text-center", "border", "border-primary", "my-0", "pb-2", "text-danger");
    }

    
    /********************************** Images Button Event Listeners *******************************************************/
    
    // radio button selected value
    let userChoice = document.querySelector('input[name="franchise"]:checked').value;

    
    /**
     * This event listener is attached to images button, checks the radio button input which is selected and appends it into the URL to which get request is sent to receive a json string array and is processed to show Images 
     * @param {the click event} event 
     */
    function showImages(event) {
        // checking user selection of the radio button and adding it as a parameter to URL
        userChoice = document.querySelector('input[name="franchise"]:checked').value;
        let parameter = "choice=" + userChoice;
        let picturesUrl = url + "?" + parameter;
        console.log(picturesUrl);

        // sending get request to the server and receives a json string response
        fetch(picturesUrl, { credentials: 'include' })
            .then(response => response.json())
            .then(objArray => createImages(objArray));
    }

    
    // creating section tag to make a bootstrap grid for images
    let picsSection = document.createElement("section");
    picsSection.classList.add("row", "w-98", "mx-auto");
    picsSection.setAttribute("id", "imagesSection");

    // adding the image section to DOM
    if (document.querySelector("img") == null) {
        document.body.appendChild(picsSection);
    }

    
    /**
     * This function processes the json array and generate image for each object in the array and a copyright message
     * @param {JSON array received as a response} objArray 
     */
    function createImages(objArray) {
        // format json array to console
        console.log(JSON.stringify(objArray, null, 2));

        // deletes old images generated from previous clicks
        let prevPicContainers = document.querySelectorAll(".picContainer");
        prevPicContainers.forEach(prevPicContainer => {
            prevPicContainer.remove();
        });

        // deletes copyright message
        let prevCopyrightMessage = document.querySelector("#imagesSection p.copyrightMessage");
        console.log(prevCopyrightMessage);
        if (prevCopyrightMessage != null) {
            prevCopyrightMessage.remove();
        }
        

        // processes each object in json array 
        objArray.forEach(element => {
            console.log(element.url);
            // creating div tag for images of each object 
            let picContainer = document.createElement("div");

            // creating h2 heading from series attribute
            let picHeading = document.createElement("h2");
            picHeading.innerText = element.series;

            // showing image
            let picture = document.createElement("img");
            console.log(element.url);
            picture.src = encodeURI(element.url);
            console.log(picture.src);
            picture.alt = element.name + "Image";
            picture.style.maxWidth = "100%";
            picture.style.maxHeight = "350px";

            // showing name of the image
            let picName = document.createElement("p");
            picName.innerText = element.name;

            //adding bootstrap classes for styling
            picContainer.classList.add("col-md", "border", "border-primary", "picContainer", "px-0");
            picHeading.classList.add("text-center", "border", "border-primary", "text-uppercase");
            picture.classList.add("mx-auto", "d-block", "mb-2");
            picName.classList.add("text-center", "border", "border-primary", "mb-0");

            // adding created elements to parent elements
            picContainer.appendChild(picHeading);
            picContainer.appendChild(picture);
            picContainer.appendChild(picName);
            picsSection.appendChild(picContainer);
         
        });

        // adds copyright message in images section
        picsSection.appendChild(getCopyrightMessagePTag());

    }
    
    

    /**
     * displays copyright message based on what radio button is selected.
     * @returns pTag the node which has copyright message in it
     */
    function getCopyrightMessagePTag() {
        let marioCopyright = "Game trademarks and copyrights are properties of their respective owners. Nintendo properties are trademarks of Nintendo. &copy; 2019 Nintendo.";
        let starwarsCopyright = "Star Wars &copy; & TM 2022 Lucasfilm Ltd. All rights reserved. Visual material &copy; 2022 Electronic Arts Inc.";
        
        let pTag = document.createElement("p");
        
        // checks radio button which is selected
        if (userChoice == "mario"){
            pTag.innerHTML = marioCopyright;
        } else {
            pTag.innerHTML = starwarsCopyright;
        }

        // styling copyright message
        pTag.classList.add("border", "border-primary", "my-0", "copyrightMessage", "text-center", "small");

        return pTag;
    }

    
    
    /**
     * Disables the input that is not selected 
     */
    function disableOtherInput() {
        console.log(userChoice);
        
        // checks the selected radio button
        if (userChoice == "mario"){
            let otherInput = document.getElementById("starwarsRadioInput");
            otherInput.setAttribute("disabled", "");
        } else {
            document.getElementById("marioRadioInput").setAttribute("disabled", "");
        }
    }

    
    
    /********************************** Information Button Event Listeners *******************************************************/

    /**
     * sends post request along with radio button input to receive JSON string to create table in DOM
     * @param {Click event on Information Button} event 
     */
    function addTable(event) {
        // checking user selection of the radio button and adding it as a parameter to URL
        userChoice = document.querySelector('input[name="franchise"]:checked').value;
        let parameter = "choice=" + userChoice;
        
        console.log(url); // debug
        
        // sends POST request
        fetch(url, {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: parameter
        })
            .then(response => response.json())
            .then(createTable);

    }

    /**
     * Creates table by adding data of each object in the array to the row of the table
     * @param {JSON array response} objArray 
     */
    function createTable(objArray) {
        
        // converts JSON array to string and format it 
        console.log(JSON.stringify(objArray, null, 2));
        
        // creating div an area to store table and its copyright information
        let tableDiv = document.createElement("div");
        tableDiv.setAttribute("id", "myTableDiv");
        
        // creating table tag
        let myTable = document.createElement("table");
        console.log(myTable);
        
        // creating header row for the table
        let thead = document.createElement("thead");
        
        let headerRow = document.createElement("tr");
        
        let headerCell1 = document.createElement("th");
        let headerCell2 = document.createElement("th");
        let headerCell3 = document.createElement("th");
        let heading1 = "Series";
        let heading2 = "Name";
        let heading3 = "Link";
        
        // adding text in each column in the header row
        headerCell1.innerText = heading1;
        headerCell2.innerText = heading2;
        headerCell3.innerText = heading3;

        // styling table and top row using bootstrap classes
        myTable.classList.add("table", "table-sm", "table-striped", "table-bordered", "table-responsive", "table-hover", "bg-light", "border", "border-primary", "my-0");
        headerRow.classList.add("text-center", "bg-success", "text-dark");

        // adding elements to their parent elements
        headerRow.appendChild(headerCell1);
        headerRow.appendChild(headerCell2);
        headerRow.appendChild(headerCell3);
        thead.appendChild(headerRow);
        myTable.appendChild(thead);

        // adds data of JSON objects in rows of the table 
        addDataToTable(myTable, objArray);
        
        // adds table and copyright message inside table area
        tableDiv.appendChild(myTable);
        tableDiv.appendChild(getCopyrightMessagePTag());


        // adding or replacing created table div to the DOM
        if(document.getElementById("myTableDiv") == null){
            document.body.appendChild(tableDiv);

        } else {
            let prevTableDiv = document.getElementById("myTableDiv");
            document.body.replaceChild(tableDiv, prevTableDiv);
        }

    }

    
    /**
     * processes JSON objects and add the information of each object in each row of the body of the table.
     * @param {Table to which JSON objects data is added} table 
     * @param {Array of JSON objects} array 
     */
    function addDataToTable(table, array) {
        let tableBody = document.createElement("tbody");

        // loop to go over each JSON object
        array.forEach(element => {
            // creating and adding data from JSON objects into cells in a row
            let row = document.createElement("tr");
            let seriesCell = document.createElement("td");
            seriesCell.innerText = element.series;
            let nameCell = document.createElement("td");
            nameCell.innerText = element.name;
            let linkCell = document.createElement("td");
            let linkTag = document.createElement("a");
            linkCell.appendChild(linkTag);
            linkTag.innerText = element.url;
            linkTag.href = element.url;
            
            // styling cells
            seriesCell.classList.add("text-center");  
            nameCell.classList.add("text-center");  

            // adding created cells and a row to the table
            row.appendChild(seriesCell);
            row.appendChild(nameCell);
            row.appendChild(linkCell);
            tableBody.appendChild(row);
        });

        // adding created tablet elements to DOM
        table.appendChild(tableBody); 
    }

});