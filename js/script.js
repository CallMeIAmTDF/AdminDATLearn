LEVEL_DEFAULT_IMAGE = "123.png"
WORD_DEFAULT_IMAGE = "123.png"

if (!window.localStorage.getItem('accessTokenADMIN') && window.location.pathname !== '/login.html') {
    window.location.href = '/login.html'
} else {
    document.getElementById('fullname').innerText = window.localStorage.getItem('fullnameADMIN')
}
document.getElementById('adminname').addEventListener('click', () => {
    window.localStorage.clear()
    window.location.href = '/'
})
function getType(type) {
    const allowedTypes = [
        "adjective",
        "adverb",
        "conjunction",
        "determiner",
        "interjection",
        "noun",
        "numeral",
        "phrase",
        "preposition",
        "pronoun",
        "sentence",
        "verb"
    ];
    const Types = [
        "adjective(Tính từ)",
        "adverb(Trạng Từ)",
        "conjunction(Liên từ)",
        "determiner(Từ hạn định)",
        "interjection(Thán từ)",
        "noun(Danh từ)",
        "numeral(Chữ số)",
        "phrase(Cụm từ)",
        "preposition(Giới từ)",
        "pronoun(Đại từ)",
        "sentence(Câu)",
        "verb(Động Từ)"
    ];
    return Types[allowedTypes.indexOf(type)];
}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function showNotic(message, status) {
    x = document.getElementById("snackbar");
    x.innerText = message;
    x.className = "show";
    if (status === 'OK') {
        x.style.background = "#6ff7a8"
    } else {
        x.style.background = "#FF5B5B"
    }
    setTimeout(function () {
        x.className = x.className.replace("show", "");
        x.style.background = "#ffffff"
    }, 3000);
}
function convertDate(dateString) {
    const date = new Date(Date.parse(dateString));
    function padNumber(number, targetLength) {
        let numberString = number.toString();
        while (numberString.length < targetLength) {
            numberString = '0' + numberString;
        }
        return numberString;
    }
    const hours = padNumber(date.getHours(), 2);
    const minutes = padNumber(date.getMinutes(), 2);
    const day = padNumber(date.getDate(), 2);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const formattedDate = `${hours}:${minutes}, Ngày ${day} ${month} ${year}`;
    return formattedDate;
}

function calculateDaysDiff(givenDateString) {
    const givenDate = new Date(Date.parse(givenDateString));
    const currentDate = new Date();
    const timeDiffMs = currentDate.getTime() - givenDate.getTime();
    const daysDiff = timeDiffMs / (1000 * 60 * 60 * 24);
    return Math.floor(daysDiff);
}

async function API(url, method, token, data) {
    if (method == 'GET' || method == 'HEAD') {
        response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error("HTTP status " + response.status);
        } return response.json();
    } else {
        response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            if (response.status == '403') {
                alert('Bạn không đủ quyền để truy cập')
            }
            throw new Error("HTTP status " + response.status);

        } return response.json();
    }
}

async function textToSpeech(word) {
    const url = 'https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize';
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '6956f736d4msh997b033f460bff8p1c10c0jsn5b13d6cfbfcc',
            'X-RapidAPI-Host': 'cloudlabs-text-to-speech.p.rapidapi.com'
        },
        body: new URLSearchParams({
            voice_code: 'en-US-1',
            text: word,
            speed: '1.00',
            pitch: '1.00',
            output_type: 'audio_url'
        })
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        if (result.status == 'success')
            document.getElementById('voice').value = result.result.audio_url
    } catch (error) {
        console.error(error);
    }
}