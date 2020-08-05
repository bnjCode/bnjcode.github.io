const hotelArr = [
    ['Candeo Hotels Roppongi', 'At a cultural hotspot, Candeo Hotels Roppongi offers you an insight into Japanese life while being modern and well furnished. The hotel has kind customer service and air conditioning.', 9.2, 'Tokyo, Japan'],
    ['Holiday Inn Nice-Centre', 'The sunny beach is right at your disposal to explore. As well as that, discover the old town in the peaceful city of Nice in southern France, and go to the bustling market.', 8.4, 'Nice, France'],
    ['Sheraton Westpark Munich', 'This hotel is located near a major subway station, so you can access Munich quickly. The city bridges the gap between modern and ancient and is home to structures like the Nymphenburg Palace.', 9.9, 'Munich, Germany'],
    ['Enterprise Hotel Milan', 'Friendly staff and easy access to the city center is combined with a city renowned as the Shopping Capital of the world. As well as that, the old town is perfect for travellers.', 8.2, 'Milan, Italy'],
    ['Ibis Hotel Annecy', 'Perfectly positioned near a highway and a bus station, so you will get to hear a lot of noise if you stay here!', 4.4, 'Annecy, France'],
    ['NH Hotels Geneva', 'A hotel renowned for being right next to a bus station.', 6.0, 'Geneva, Switzerland'],
    ['Novotel Basel', 'The best customer service! Also access the city of Basel by walking.', 7.1, 'Basel, Switzerland'],
    ['NH Hotels Turin', 'Same as Geneva, except the rooms are a lot more spacious.', 8.8, 'Turin, Italy'],
    ['Yello Hotel Harmoni Jakarta', 'This hotel is very hard to access, so expect long exploration!', 7.6],
    ['Nusa Dua Hotel Bali', 'Excels at almost everything. Breakfast is the best around, located near a sandy beach, exceptional.', 10.0, 'Bali, Indonesia'],
    ['Airport hotel Soekarno-Hatta', 'Not known for the facility itself, but it is the only place to stay when your flight gets delayed', 6.8, 'Jakarta, Indonesia'],
    ['Hotel Las Palmas', 'Hotel Las Palmas is located right next to the beach. Regular events are held at the hotel to keep you occupied. Kayak with one of our guides or enjoy our spa.', 7.1, 'Albufeira, Portugal'],
    ['Cedar Motel', 'Located in Vancouver. It is a fictional motel that is known for improper maintenance.', 1.1, 'Vancouver, Canada']
];
console.log(localStorage.getItem('bookcoin'));
let id = 0;
let bookmarks = [];
let bookings = [];
let state = 'bookmarks';
let inBooking = false;
const autoComplete = () => {
    const val = document.querySelector('.search__input').value.toLowerCase();
    document.querySelector('.search__results-list').innerHTML = '';
    let resultsArr = [];
    let ids = [];
    hotelArr.forEach((el, index) => {
        if (el[0].toLowerCase().indexOf(val) !== -1 && val.length == 1) {
            resultsArr.push(el);
            ids.push(index);
        } else if (val.length > 1) {
            console.log('val length is more than 1');
            for (let i = 0; i < el[0].length - val.length; i++) {
                if (el[0].toLowerCase().substring(i, i+val.length) == val) {
                    resultsArr.push(el);
                    ids.push(index);
                    console.log('added');
                    break;
                }
            }
        }
    });
    resultsArr.forEach((el, index, array) => {
        let html = '<li class="search__results-list__item" id="%id%"><a href="#" class="search__results-link">%name%</a>%rating%<p class="search__results-item__des">%des%</p></li>';
        html = html.replace('%name%', el[0]);
        let des;
        if (el[1].length > 40) {
            des = el[1].substring(0, 39);
            des += '...';
        } else {
            des = el[1];
        }
        html = html.replace('%des%', des);
        html = html.replace('%rating%', el[2]);
        html = html.replace('%id%', ids[index]);
        document.querySelector('.search__results-list').insertAdjacentHTML('beforeend', html);
    })
    if (resultsArr.length == 0) {
        document.querySelector('.search__results-list').style.display = 'none';
    } else {
        document.querySelector('.search__results-list').style.display = 'block';
    }
}
const timer = () => {
    const date = new Date();
    const curtime = date.getHours()*3600+date.getMinutes()*60+date.getSeconds();
    const midnight = 24*3600;
    const timeLeft = midnight - curtime;
    const hours = Math.floor(timeLeft/3600);
    const minutes = Math.floor(timeLeft/60)-(hours*60);
    const seconds = timeLeft-(hours*3600)-(minutes*60);
    document.querySelector('.timer').textContent = hours+'h '+minutes+'m '+seconds+'s';
}
const bookmark = (name, des, id, bool) => {
    if (!bookmarks.includes([name, des])) {
        if (bool) {
            bookmarks.push([name, des]);
        }
        persist();
        let bhtml = '<li class="bookmarks__list__item" id="%id%"><a href="#" class="bookmarks__list__item-link">%name%</a><p class="bookmarks__list__item-loc">%des%</p></li>';
        bhtml = bhtml.replace('%name%', name);
        bhtml = bhtml.replace('%des%', des);
        bhtml = bhtml.replace('%id%', id);
        document.querySelector('.bookmarks__list').insertAdjacentHTML('beforeend', bhtml);
    }
}
const loadBookmark = () => {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        document.querySelector('.bookmarks__list').innerHTML = '';
        bookmarks.forEach((cur, ind, arr) => {
            bookmark(cur[0], cur[1], id, false);
            id += 1;
        })
    } else {
        localStorage.setItem('bookmarks', bookmarks);
    }
}
const loadBookings = () => {
    if (localStorage.getItem('bookings')) {
        bookings.forEach((el) => {
            let bookHTML = '<li class="bookmarks__list__item" id="%id%"><a href="#" class="bookmarks__list__item-link">%name%</a><p class="bookmarks__list__item-loc">%des%</p></li>';
            bookHTML = bookHTML.replace('%name%', el[0]);
            bookHTML = bookHTML.replace('%des%', extract(el[1], 30));
            document.querySelector('.bookmarks__list').insertAdjacentHTML('beforeend', bookHTML);
        })
    }
}
const loadBookingsBegin = () => {
    if (localStorage.getItem('bookings')) {
        bookings = JSON.parse(localStorage.getItem('bookings'));
    } else {
        localStorage.setItem('bookings', bookings);
    }
}
const loadBookmarkExtra = () => {
    if (localStorage.getItem('bookmarks')) {
        bookmarks.forEach((el) => {
            let bookHTML = '<li class="bookmarks__list__item" id="%id%"><a href="#" class="bookmarks__list__item-link">%name%</a><p class="bookmarks__list__item-loc">%des%</p></li>';
            bookHTML = bookHTML.replace('%name%', el[0]);
            bookHTML = bookHTML.replace('%des%', extract(el[1], 30));
            document.querySelector('.bookmarks__list').insertAdjacentHTML('beforeend', bookHTML);
        })
    }
}
const persist = () => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}
const extract = (str, max) => {
    if (str.length > max) {
        return str.substring(0, max);
    } else {
        return str;
    }
}
const normalize = (string) => {
    let entered = false;
    let result = '';
    for (let i = 0; i < string.length; i++) {
        if (string[i] != ' ') {
            entered = true;
        }
        if (i != string.length - 1 && string[i] + string[i+1] == '  ') {
            entered = false;
        }
        if (entered) {
            result += string[i];
        }
    }
    return result;
}
const clearBookmarks = () => {
    // For testing purposes only
    localStorage.removeItem('bookmarks');
    bookmarks = [];
}
const changeContent = (id) => {
    const NumberId = parseInt(id);
    document.querySelector('.overview__heading').textContent = hotelArr[id][0];
    document.getElementById('p').textContent = hotelArr[id][1];
    document.getElementById('p2').textContent = hotelArr[id][1];
    document.querySelector('.overview__rating-average').textContent = hotelArr[id][2];
    document.getElementById('loc').textContent = hotelArr[id][3];
}
const controlBook = () => {
    document.getElementById('popup1').style.display = 'block';
    let step = 1;
    let adultValue, childValue, name, type, typer;
    let charge;
    name = document.querySelector('.overview__heading').textContent;
    document.querySelector('.popup__nextstep').addEventListener('click', () => {
        console.log(step);
            if (step == 1) {
                adultValue = parseInt(document.getElementById('adult').value);
                childValue = parseInt(document.getElementById('child').value);
                type = adultValue + ' adults, '+childValue+' children';
                if (adultValue > 10 || adultValue < 1) {
                    alert('Adult value must be between 1 and 10')
                } else if (childValue > 10 || childValue < 1) {
                    alert('Child value must be between 1 and 10')
                } else {
                    step = 2;
                    document.getElementById('popup2').style.display = 'block';
                    document.getElementById('popup1').style.display = 'none';
                    document.querySelector('.popup__heading2').textContent = 'Step 2 of 3';
                    document.querySelector('.popup__paragraph2').textContent = 'You selected '+adultValue+' adults and '+childValue+' child. Please specify the type of room you would like.';
                }
            } 
            
    })
    document.querySelector('.popup__nextstep2').addEventListener('click', () => {
        if (step == 2) {
            console.log(step);
            typer = document.querySelector('.popup__input-select').value;
            let shortened;
            if (typer[0] == 'Q') {
                shortened = 1;
            } else if (typer[0] == 'F') {
                shortened = 2;
            } else if (typer[0] == 'H') {
                shortened = 3;
            } else {
                shortened = 4;
            }
            const day = new Date();
            if (shortened == 1) {
                if (day.getMonth() == 6 || day.getMonth() == 7 || day.getMonth() == 0 || day.getMonth() == 11) {
                    charge = adultValue * 400 + childValue * 200;
                } else {
                    charge = adultValue * 200 + childValue * 100;
                }
            } else if (shortened == 2) {
                if (day.getMonth() == 6 || day.getMonth() == 7 || day.getMonth() == 0 || day.getMonth() == 11) {
                    charge = adultValue * 800 + childValue * 400;
                } else {
                    charge = adultValue * 400 + childValue * 200;
                }
            } else if (shortened == 3) {
                if (day.getMonth() == 6 || day.getMonth() == 7 || day.getMonth() == 0 || day.getMonth() == 11) {
                    charge = adultValue * 1400 + childValue * 700;
                } else {
                    charge = adultValue * 700 + childValue * 350;
                }
            } else if (shortened == 4) {
                if (day.getMonth() == 6 || day.getMonth() == 7 || day.getMonth() == 0 || day.getMonth() == 11) {
                    charge = adultValue * 500 + childValue * 250;
                } else {
                    charge = adultValue * 1000 + childValue * 500;
                }
            }
            if (bookcoin > charge) {
                document.getElementById('popup3').style.display = 'block';
                document.getElementById('popup2').style.display = 'none';
                step = 3;
                const discount = (20000 - bookcoin) / 100;
                const useDiscount = confirm('You have a discount of '+discount+' B. Use it?');
                if (useDiscount) {
                    charge -= discount;
                }
                document.querySelector('.popup__heading3').textContent = 'Step 3 of 3';
                document.querySelector('.popup__paragraph3').textContent = 'Please pay '+charge+' Bookcoin for your stay.'
                document.querySelector('.popup__alert3').textContent = 'This step cannot be reversed. '+charge+' Bookcoin will be charged to your account.';
            } else {
                alert("Uh oh! Looks like you don't have enough Bookcoin to buy this stay!")
            }
        }
    })
    document.querySelector('.popup__nextstep3').addEventListener('click', () => {
        if (step == 3) {
            bookcoin -= charge;
            persistBookCoin();
            document.querySelector('.bookcoin').textContent = 'B '+bookcoin;
            document.getElementById('popup3').style.display = 'none';
            bookings.push([name, type]);
            localStorage.setItem('bookings', JSON.stringify(bookings));
        }
    })
    document.getElementById('a').addEventListener('click', ()=>{
        console.log('close');
        document.querySelector('#popup1').style.display = 'none';
    })
    document.getElementById('a2').addEventListener('click', ()=>{
        console.log('close');
        document.querySelector('#popup2').style.display = 'none';
    })
    document.getElementById('a3').addEventListener('click', ()=>{
        console.log('close');
        document.querySelector('#popup3').style.display = 'none';
    })
}
let bookcoin;
const persistBookCoin = () => {
    localStorage.setItem('bookcoin', bookcoin);
}
const controlBookCoin = () => {
    if (!localStorage.getItem('bookcoin')) {
        localStorage.setItem('bookcoin', 20000);
        bookcoin = 20000;
    } else {
        console.log(true);
        bookcoin = localStorage.getItem('bookcoin');
    }
    document.querySelector('.bookcoin').textContent = 'B '+localStorage.getItem('bookcoin');
}
const name = () => {
    if (!localStorage.getItem('name')) {
        const name = prompt('Enter your name');
        localStorage.setItem('name', name);
    }
    document.querySelector('.user-nav__user-name').textContent = localStorage.getItem('name');
}
document.getElementById('bookmark').addEventListener('click', () => {
    let name = document.querySelector('.overview__heading').textContent;
    let subdes = document.getElementById('p').textContent;
    name = normalize(name);
    subdes = normalize(subdes);
    console.log(name.length);
    console.log(subdes.length);
    const des = extract(subdes, 30);
    bookmark(name, des, id, true);
});
document.querySelector('.container').addEventListener('click', (e) => {
    if (e.target.matches('.search__results-list__item, .search__results-list__item *')) {
        console.log(e.target.id);
        changeContent(e.target.id);
    }
})
document.getElementById('button').addEventListener('click', () => {
    controlBook();
})
document.getElementById('checkBookings').addEventListener('click', () => {
    if (state == 'bookmarks') {
        state = 'bookings';
        document.querySelector('.bookmarks__list').innerHTML = '';
        loadBookings();
    } else {
        state = 'bookmarks';
        document.querySelector('.bookmarks__list').innerHTML = '';
        loadBookmarkExtra();
    }
})
setTimeout('name()', 1000);
loadBookmark();
loadBookingsBegin();
controlBookCoin();
setInterval('autoComplete()', 1000);
setInterval('timer()', 1000);