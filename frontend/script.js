
  /*
    Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
    SPDX-License-Identifier: MIT-0

    Permission is hereby granted, free of charge, to any person obtaining a copy of this
    software and associated documentation files (the "Software"), to deal in the Software
    without restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

    document.addEventListener('DOMContentLoaded', function() {
        const contextInput = document.getElementById('context');
        const audioPlayer = document.getElementById('audioPlayer');
        const loadingElement = document.getElementById('loading');
        const languages = document.getElementsByName('language');
    
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                generateStory();
            }
        });
    
        function generateStory() {
            const context = contextInput.value;
            let language;
            for (let i = 0; i < languages.length; i++) {
                if (languages[i].checked) {
                    language = languages[i].value;
                    break;
                }
            }
    
            const payload = {
                context: context,
                language: language
            };
    
            loadingElement.classList.remove('hidden');
    
            fetch('YOUR_API_GATEWAY_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then(response => response.json())
            .then(data => {
                const mp3Url = data.mp3Url;
                audioPlayer.src = mp3Url;
                audioPlayer.classList.remove('hidden');
                contextInput.value = '';
                loadingElement.classList.add('hidden');
            })
            .catch((error) => {
                console.error('Error:', error);
                loadingElement.classList.add('hidden');
            });
        }
      });
    