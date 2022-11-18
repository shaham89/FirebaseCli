const functions = require("firebase-functions");

const admin = require('firebase-admin');

admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've successfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

exports.addAccount = functions.auth.user().onCreate(user => {
  const id = user.uid;

  console.log("id:" + id);
  console.log("admin:" + admin.instanceId());
  return admin.firestore().collection('users').doc(id).update({displayName: user.displayName, photoURL: user.photoURL}).then(() => {
    console.log("writing users:" + id);
   }, (error) => {
    console.error('Failed to add user');
    console.error(error);
   });
});

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// exports.api = functions.https.onRequest( async (request, response) => {
//   const body = request.body;
//   switch(request.method){
//     case 'GET':     
//       const axiosResponse = await axios.get('https://jsonplaceholder.typicode.com/users/1');
//       response.send(axiosResponse.data);

//       break;
//       case 'POST':
//       response.send(body);
//       break;
//       case 'DELETE':
//       response.send('IT was a DELETE request' + body);
//       response.send(body);
//       break;
//     default:
//       response.send('IT was a default request' + body);
//       response.send(body);
//   }
// });


// exports.userAdded = functions.auth.user().onCreate(user => {

//   console.log(`${user.uid} is uid..`);
//   console.log(`${user.displayName } is display..`);
//   console.log(`${user.email} is email..`);
//   console.log(admin.database().getRulesJSON());
//   return admin.database().ref("/users/"+user.uid+"/info/status").set("ok");
// });