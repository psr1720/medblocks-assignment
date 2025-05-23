# medblocks-assignment
this is my submission for the frontend only patient registration app with pglite

## Setup and usage instructions
### Setup
#### 1. clone the github repository.
```
git clone https://github.com/psr1720/medblocks-assignment.git
```
#### 2. go to the folder where the project is located.
```
cd medblocks-assignment
```
#### 3. install the required dependencies.(NOTE: you need nodejs to proceed further from here if you don't have it download it from https://nodejs.org/en/download)
```
npm install
```
#### 4. run the app locally in dev mode.
```
npm run dev
```

### Usage
#### Application user interface

##### Dashboard page:
![Screenshot of the application](./docs/Screenshot%202025-05-23%20113209.png)

#### Contains 5 pages. Dashboard, Patients, Register Patient, View Patient and Run Queries..

**Navigation**: Use the left nav bar to go to any page you wish to. Additionally you can also make use of the dashboard page to navigate

**Dashboard**: Use it to navigate to any of the other pages by clicking any of the cards. To come back to dashboard use the left nav bar or click on the logo top left of the page.

**Patients**: Use the patients page to look at all the patients registered in tabular format. Use the buttons in the table look at specific patient info or to log a complaint made by the patient.

**Register Patient**: Use the register patient page to register a new patient into the system.

**View Patient**: Use the view patient to view a specific patient's record the patient id is present in the Patients page table. Can also navigate to this page by clicking the button in Patients page.

**Run Queries**: Use the run queries page to run raw sql queries and fetch information from the database. NOTE: database only has two tables **patients** and **complaints** trying to get info from tables that don't exist will fail. Only execute a singular SELECT query attempt to do otherwise will also fail.

