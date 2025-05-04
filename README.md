# T19Project

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

## Development server

To start a local development server, run:

```bash
ng serve --host  [your assigned lab computer].cs.colostate.edu --port [your assigned port #]
```

Once the server is running, open your browser and navigate to `http://[lab computer name].cs.colostate.edu:[your port #]/`. Or just read the http url that the terminal spits out at you when you run the ng serve command from above. 

## Database Setup

This project uses a MySQL database hosted on the CSU department server (faure.cs.colostate.edu). A PHP script (run_colors_setup.php) is provided to create and populate the colors table. Follow the steps below to get your backend set up.

### 1. Upload Files to Your Course Account

Copy the following files into your local_html directory on a course machine:
- run_colors_setup.php
- colors.sql

Run `chmod 755 run_colors_setup.php colors.sql` to give proper read access permissions to the files. 

### 2. Edit Your Credentials

Open run_colors_setup.php and update the database credentials:

- $servername = "faure";
- $username = "your_eid";         // Your CSU eID
- $password = "your_student_id";  // Your CSU Student ID number
- $db = "your_eid";               // Usually the same as your eID

### 3. Run the Setup Script

Visit https://cs.colostate.edu:4444/~your_eid/run_colors_setup.php in browser

If successful you should see {"message":"Colors table setup completed."}

4. Verify the Table / SET Password

To manually check that the table was created and set your password:

1. In terminal: mysql -u your_eid -D your_eid -h faure -p

2. Enter password: (student id)

Now you should be in MYSQL. First set your password:

3. set password = password('newpasswd');

Then check the table creation:

4. In mysql run: SELECT * FROM colors;


