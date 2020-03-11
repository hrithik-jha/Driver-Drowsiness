const date = new Date();
let data = [];
for (let i = 0; i < 20; i++) {
    let isDrowsy, time;
    let zeroOne = Math.round(Math.random());
    isDrowsy = zeroOne === 1;
    time = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + "/" + " " +
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    data.push({time, isDrowsy});
}
console.log(data);