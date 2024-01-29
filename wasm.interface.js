
function callMyTest(input) {
  // Convert the input string to a C-style string (char*)
  var myString = input;

  // Allocate memory for the result buffer
  var resultBufferSize = 1024; // Adjust the size accordingly

  // Import the Emscripten module and assign it to a variable (e.g., Module).
  var resultBuffer = mod._malloc(resultBufferSize);

  // Call the mytest function in C++ and pass the result buffer
  mod.ccall('mytest', 'void', ['string', 'number', 'number'], [myString, resultBuffer, resultBufferSize]);

  // Retrieve the result from the result buffer
  var result = mod.UTF8ToString(resultBuffer, 1024);

  // Free the allocated memory
  mod._free(resultBuffer);

  // Use the result as needed
  console.log("Result from Wasm:", result);

  return result;
}

function callQueryTest(input) {
  // Convert the input string to a C-style string (char*)
  var myString = input;

  // Allocate memory for the result buffer
  var resultBufferSize = 1024; // Adjust the size accordingly

  // Import the Emscripten module and assign it to a variable (e.g., Module).
  var resultBuffer = mod._malloc(resultBufferSize);

  var result = -1;
  try {
    // Call the querytest function in C++ and pass the result buffer
    mod.ccall('querytest', 'void', ['string', 'number', 'number'], [myString, resultBuffer, resultBufferSize]);

    // Retrieve the result from the result buffer
    result = mod.UTF8ToString(resultBuffer, resultBufferSize);

    // Use the result as needed
    console.log("Result from Wasm:", result);
  } catch (error) {
    // Handle the exception
    console.error("Error in Wasm API call:", error.message);

    // Copy the error message into the result buffer
    var errorMessage = "Wasm API call failed: " + error.message;
    result = errorMessage;
  } finally {
    // Free the allocated memory
    mod._free(resultBuffer);
  }

  return result;
}
