document.addEventListener('DOMContentLoaded', function () {
  var initialCols = Math.floor(window.innerWidth / 10);
  var term = new Terminal({
    cursorBlink: "block",
    cols: initialCols,
  });
  var curr_line = "";
  var entries = [];
  var historyIndex = 0;
  term.open(document.getElementById("terminal"));

  // Handle window resize to dynamically adjust the terminal width
  window.addEventListener('resize', function () {
    var newCols = Math.floor(window.innerWidth / 10); // Adjust the divisor as needed
    var newRows = term.rows; // Keep the current number of rows
    term.resize(newCols, newRows);
  });

  term.help = function () {
    term.writeln("support commands: [\\cls, \\test, \\help]");
  };
  term.prompt = function () {
    if (curr_line) {
      if (curr_line.startsWith("\\")) {
        var argument;
        if (curr_line === "\\cls") {
          term.clear();
        }
        else if (curr_line.startsWith("\\test")) {
          argument = curr_line.substring(5).trim(); // Extract the substring following "test"
          result = callMyTest(argument);
          term.writeln(result);
        }
        else if (curr_line === "\\help") {
          term.help();
        }
        else {
          term.writeln("Unknown command: " + curr_line);
        }
      }
      else {
        argument = curr_line;
        result = callQueryTest(argument);

        // Convert \n split lines to \n\r
        const lines = result.split('\n');
        lines.forEach(line => term.writeln(line));
      }
      curr_line = "";
      historyIndex = entries.length;
    }

    term.write("db3 shell $ ");
  };
  term.prompt();

  term.onKey(e => {
    const printable = !e.domEvent.altKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

    if (e.domEvent.keyCode == 0xd) {
      // Handle 'enter' key
      if (curr_line.length > 0) {
        entries.push(curr_line);
        term.write("\r\n");
        term.prompt();
      } else if (entries.length > 0) {
        curr_line = entries[historyIndex - 1];
        term.write('\r\x1B[K'); // Clear the current line
        term.write("db3 shell $ ");
        term.write(curr_line);
        term.write("\r\n");
        term.prompt();
      }
    } else if (e.domEvent.keyCode==0x8) {
      // Handle 'backspace' key
      if (curr_line.length > 0) {
        curr_line = curr_line.slice(0, -1);
        term.write('\b \b'); // Move the cursor back and clear the character
      }
    } else if (isArrowKey(e.domEvent.keyCode)) {
      // Handle arrow keys for command history
      if (e.domEvent.keyCode == 38 && historyIndex > 0) {
        // Up arrow key
        historyIndex--;
        curr_line = entries[historyIndex];
        term.write('\r\x1B[K'); // Clear the current line
        term.write("db3 shell $ ");
        term.write(curr_line);
      } else if (e.domEvent.keyCode == 40 && historyIndex
                 < entries.length - 1) {
        // Down arrow key
        historyIndex++;
        curr_line = entries[historyIndex];
        term.write('\r\x1B[K'); // Clear the current line
        term.write("db3 shell $ ");
        term.write(curr_line);
      }
    } else if (e.domEvent.ctrlKey) {
      if (e.domEvent.keyCode === 0x43){
        // Handle Ctrl+C
        term.write('\r\n'); // Start a new line
        curr_line = "";
        term.prompt(); // Show the prompt
      } else if (e.domEvent.keyCode=== 0x56) {
        // Handle Ctrl+V, paste
        if (navigator.clipboard) {
          navigator.clipboard.readText()
            .then(text => {
              term.write(text);
              curr_line += text;
            });
        } else {
          // Clipboard API is not supported, handle accordingly
          console.error('Clipboard API is not supported in this browser.');
        }
      }
    } else if (printable) {
      curr_line += e.key;
      term.write(e.key);
    }
  });
});

function isArrowKey(keyCode) {
  // Check if the keyCode corresponds to an arrow key
  return keyCode >= 37 && keyCode
    <= 40;
}
