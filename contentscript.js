window.onload = function(){

		// CSS Stylesheet
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.vocab_bold { font-weight: bold;} .tooltip { display: inline; position: relative;} .tooltip:hover:after {background: #333;background: rgba(0,0,0,.8);border-radius: 5px;bottom: 26px;color: #fff;content: attr(title);left: 20%;padding: 5px 15px;position: absolute;z-index: 98;width: 220px;}.tooltip:hover:before{border: solid;border-color: #333 transparent;border-width: 6px 6px 0 6px;bottom: 20px;content: "";left: 50%;position: absolute;z-index: 99;}';
		document.getElementsByTagName('head')[0].appendChild(style);
		//End CSS Stylehseet

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
					var word_with_def = String(vocab_by_lines[i]);
					//console.log(word_with_def);
					// word | defintion
					var word_split_def = word_with_def.split(" | ");
					var word = word_split_def[0];
					var def = word_split_def[1];
					var hashed_word = (String(word)).hashCode();
					vocab_ht[hashed_word] = def;
				}
				console.log(vocab_ht);
				// Get all of the text content from the <p> elements in the page
				var paragraphs = document.getElementsByTagName('p');
				var num_paragrpahs = paragraphs.length;
				// Going down would be more efficient
				for (var i = 0; i < num_paragrpahs; i++) {
					var paragraph_text = paragraphs[i].innerText; 
					var paragraph_words = paragraph_text.split(" ");
					
					for (var j = 0; j < paragraph_words.length; j++) {
					// Hash it
						var hc = (String(paragraph_words[j])).hashCode();
						//console.log("hash is:" + hc);
						if (vocab_ht[hc] !== undefined) {
							var not_bold = paragraph_words[j];
							var definition = vocab_ht[hc];
							paragraph_words[j] = "<a href='#' title='" + definition + "'class='tooltip'> <span title='more' class='vocab_bold'>" + not_bold + "</span> </a>";
						}
					}
					paragraphs[i].innerHTML = paragraph_words.join(" ");
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
