window.onload = function(){
	//if (window.File && window.FileReader && window.FileList && window.Blob) {
		//var reader = new FileReader();
		//var vocab_file = chrome.extension.getURL('vocab.txt');
		var xhr = new XMLHttpRequest();
		xhr.open('GET', chrome.extension.getURL('vocab.txt'), true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
				// Split by new line
				var vocab_by_lines = xhr.responseText.split("\n");
				console.log(vocab_by_lines);
				var vocab_ht = new Object();
				// Add all of the words to a HT
				for (var i = 0; i < vocab_by_lines.length; i++) {
					console.log("vocab word is: " + vocab_by_lines[i]);
					var hashed_word = (String(vocab_by_lines[i])).hashCode();
					console.log("hash is: " + hashed_word);
					vocab_ht[hashed_word] = 1;
				}
				console.log(vocab_ht);

				// Get all of the text content from the <p> elements in the page
				var paragraphs = document.getElementsByTagName('p');
				for (var i = 0; i < paragraphs.length; i++) {
					var paragraph_text = paragraphs[i].innerText;
					var paragraph_words = paragraph_text.split(" ");
					
					for (var j = 0; j < paragraph_words.length; j++) {
					// Hash it
						var hc = (String(paragraph_words[j])).hashCode();
						//console.log("hash is:" + hc);
						if (vocab_ht[hc] == 1) {
							console.log("at a vocab word");
							var not_bold = paragraph_words[j];
							paragraph_words[j] = "yolo";
						}
					}
					paragraphs[i].innerText = paragraph_words.join(" ");
				}
			}
		};
		xhr.send();
};

String.prototype.hashCode = function(){
    var hash = 0, i, char;
    if (this.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char  = this.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
