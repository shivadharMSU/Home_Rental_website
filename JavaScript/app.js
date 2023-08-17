const fs = require('fs'); // Import the fs module
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise'); // Use promise version of mysql2
const cors = require('cors'); // Import the cors package
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); // Use the cors middleware

// Define MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'shivadhar',
  database: 'HomeRentalDB',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});

// Assuming you have already set up your Express app and configured the database connection pool

app.get('/getstatedetails', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    const sql = 'CALL GetStateDetails()';
    const [result] = await connection.query(sql);

    connection.release(); // Release the connection back to the pool

    console.log('Stored procedure called successfully');
    res.json(result[0]); // Assuming the stored procedure returns a result set
  } catch (err) {
    console.error('Error calling stored procedure:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
  finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});

// Assuming you have already set up your Express app and configured the database connection pool

app.get('/getcitiesbystateid/:stateId', async (req, res) => {
  const stateId = req.params.stateId;
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    const sql = 'CALL GetCitiesByStateId(?)';
    const [result] = await connection.query(sql, [stateId]);

    connection.release(); // Release the connection back to the pool

    console.log('Stored procedure called successfully');
    res.json(result[0]); // Assuming the stored procedure returns a result set
  } catch (err) {
    console.error('Error calling stored procedure:', err);
    res.status(500).json({ error: 'An error occurred' });
  }finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});


app.get('/getpropertytype', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    const sql = 'CALL GetPropertyTypes()';
    const [result] = await connection.query(sql);

    connection.release(); // Release the connection back to the pool

    console.log('Stored procedure called successfully');
    res.json(result[0]); // Assuming the stored procedure returns a result set
  } catch (err) {
    console.error('Error calling stored procedure:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
  finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});

app.post('/getfilteredproperties', async (req, res) => {
  const { stateId, cityId, price, propertyTypeId, propertyId,ownerId } = req.body;
  let connection;
  try {
      connection = await pool.getConnection(); // Get a connection from the pool

      const sql = `
          CALL GetFilteredProperties(?, ?, ?, ?,?,?);
      `;
      const [rows] = await connection.query(sql, [stateId, cityId, price, propertyTypeId,propertyId,ownerId]);

      connection.release(); // Release the connection back to the pool

      res.json(rows[0]); // Assuming the result of the stored procedure is an array of objects
  } catch (err) {
      console.error('Error calling stored procedure:', err);
      res.status(500).json({ error: 'An error occurred' });
  }
  finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});


app.post('/bookAppointment', async (req, res) => {
  const { PropertyId, CustomerId } = req.body;

  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    const insertQuery = `CALL InsertBookAppointment(?, ?)`;

    const [results] = await connection.query(insertQuery, [PropertyId, CustomerId]);

    connection.release(); // Release the connection back to the pool

    if (results.length > 0 && results[0][0].Result === 'Success') {
      res.json({ message: 'Appointment successfully booked' });
    } else {
      res.status(400).json({ error: 'Appointment already exists for the same property and customer' });
    }
  } catch (err) {
    console.error('Error inserting appointment:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});

app.get('/appointmentsByOwner/:ownerId', async (req, res) => {
  const ownerId = req.params.ownerId;

  let connection;
  try {
    connection = await pool.getConnection();
    
    const sql = 'CALL GetAppointmentsByOwnerId(?)';
    const [rows] = await connection.query(sql, [ownerId]);
    
    connection.release();
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error calling stored procedure:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

app.get('/appointmentsByCustomer/:customerId', async (req, res) => {
  const customerId = req.params.customerId;

  let connection;
  try {
    connection = await pool.getConnection();
    
    const sql = 'CALL GetAppointmentsByCustomerId(?)';
    const [rows] = await connection.query(sql, [customerId]);
    
    connection.release();
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error calling stored procedure:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});



// Define POST API to call SaveUsers stored procedure
app.post('/saveuser', async (req, res) => {
  const { UserName, FirstName, LastName, MiddleName, Password, UserTypeId, MobileNumber } = req.body;

  try {
    const connection = await pool.getConnection(); // Get a connection from the pool

    const sql = 'CALL SaveUsers(?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.query(sql, [UserName, FirstName, LastName, MiddleName, Password, UserTypeId, MobileNumber]);

    connection.release(); // Release the connection back to the pool

    console.log('Stored procedure called successfully');
    res.json({ message: 'Data saved successfully', result });
  } catch (err) {
    console.error('Error calling stored procedure:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Create API endpoint to call InsertOrUpdatePropertyDetails SP
app.post('/insertOrUpdateProperty', async (req, res) => {
  const {
    p_propertyId,
    p_propertyName,
    p_description,
    p_stateId,
    p_cityId,
    p_price,
    p_propertyTypeId,
    p_amenities,
    p_availabilityDate,
    p_fullAddress,
    p_latitude,
    p_longitude,
    p_ownerId,
    p_isApprovedByAdmin,
    p_imageNames
  } = req.body;

  const sql = `CALL InsertOrUpdatePropertyDetails(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
  const params = [
    p_propertyId,
    p_propertyName,
    p_description,
    p_stateId,
    p_cityId,
    p_price,
    p_propertyTypeId,
    p_amenities,
    p_availabilityDate,
    p_ownerId,
    p_fullAddress,
    p_latitude,
    p_longitude,   
    p_isApprovedByAdmin,
    p_imageNames
  ];
  console.log(params);

  let connection; // Declare the connection variable outside the try block

  try {
    connection = await pool.getConnection(); // Acquire a connection from the pool

    const [result] = await connection.query(sql, params);
    connection.release(); // Release the connection back to the pool

    console.log('Stored procedure called successfully');
    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});


app.get('/propertiesToApprove', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.query('CALL GetPropertiesToApprove()');
    
    connection.release();

    res.json(rows[0]); // Assuming the result of the stored procedure is an array of objects

  } catch (error) {
    console.error('Error calling stored procedure:', error);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});

app.post('/approveProperty', async (req, res) => {
  const { PropertyId } = req.body;
  let connection;
  try {
    connection = await pool.getConnection();
    
    const updateQuery = `CALL UpdatePropertyApproval(?)`;
    await connection.query(updateQuery, [PropertyId]);

    connection.release();

    res.json({ message: 'Property approval updated successfully' });
  } catch (error) {
    console.error('Error updating property approval:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
  finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});

app.post('/authenticate', async (req, res) => {
  const { username, password } = req.body;

  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    const authenticateQuery = `CALL AuthenticateUser(?, ?)`;

    const [rows] = await connection.query(authenticateQuery, [username, password]);

    connection.release(); // Release the connection back to the pool

    const user = rows[0][0]; // Retrieve the first row of the first result set

    if (user && user.UserId !== null) {
      res.json({ userId: user.UserId, name: user.Name, userType : user.UserType });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error authenticating user:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});





app.post('/deleteProperty', async (req, res) => {
  console.log("inside delete");
  const { propertyId } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection(); // Get a connection from the pool

    const deleteQuery = `CALL DeleteProperty(?)`;

    const [results] = await connection.query(deleteQuery, [propertyId]);

    connection.release(); // Release the connection back to the pool

    console.log(results);
    console.log(results.length);
    
    console.info(results);
    console.info(results.length);
    res.json({ message: 'record Deleted successFully' });


    
  } catch (err) {
    console.error('Error deleting appointments:', err);
    res.status(500).json({ error: 'An error occurred' });
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
});


// async function getUserTypes(isAdmin) {
//      try{
//       // Connect to the database
//       const db = await pool.getConnection(); // Get a connection from the pool
  
//       // Call the stored procedure
//       const [rows, fields] = await db.execute('CALL GetUserTypes(?)', [isAdmin]);
  
//       return rows;
//     } catch (error) {
//       console.error('Error:', error);
//       throw error;
//     } finally {
//       connection.release(); // Release the connection back to the pool
//     }
//   }


////Upload images >>start

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const filename = uniqueSuffix + fileExtension;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.post('/upload', upload.array('imageFiles'), (req, res) => {

  if (req.files && req.files.length > 0) {
    const uploadedFiles = req.files.map(file => file.filename);
    res.json({ success: true, message: 'Images uploaded successfully.', uploadedFiles: uploadedFiles });
  } else {
    res.status(500).json({ success: false, message: 'Error uploading images.' });
  }
});

// Create the 'uploads' folder if it doesn't exist
const uploadsFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}


////Upload images >>  end


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// const express = require('express');
// const bodyParser = require('body-parser');
// const mysql = require('mysql2');

// const app = express();
// const port = 3000;

// // Configure MySQL connection
// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'vinod',
//   database: 'HomeRentalDB'
// });

// function ConnecttoDB() {
//   db.connect(err => {
//     if (err) {
//       console.error('Error connecting to database:', err);
//       return;
//     }
//     console.log('Connected to database');
//   });
// }

// function CloseDB() {
//   db.end();
//   console.log('Database connection closed');
// }

// app.use(bodyParser.json());

// // Define POST API to call SaveUsers stored procedure
// app.post('/saveuser', async (req, res) => {
//     const { UserName, FirstName, LastName, MiddleName, Password, UserTypeId, MobileNumber } = req.body;
  
//     try {
//       ConnecttoDB();
//       console.log('connection successfully');

//       const sql = 'CALL SaveUsers(?, ?, ?, ?, ?, ?, ?)';
//       const [result] = await db.promise().query(sql, [UserName, FirstName, LastName, MiddleName, Password, UserTypeId, MobileNumber]);
  
//       CloseDB();
  
//       console.log('Stored procedure called successfully');
//       res.json({ message: 'Data saved successfully', result });
//     } catch (err) {
//       console.error('Error while saving the user details', err);
//       res.status(500).json({ error: 'Error while saving the user details '+err });
//     }
//   });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
