const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const N = 500;
const cars = generateCars(N);
let alphaCar = cars[0];
if (localStorage.getItem("alphaCar")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("alphaCar"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY"),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY"),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY"),
  new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY"),
  new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY"),
  new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY"),
  new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY"),
];

animate();

function save() {
  localStorage.setItem("alphaCar", JSON.stringify(alphaCar.brain));
}

function discard() {
  localStorage.removeItem("alphaCar");
}

function generateCars(num) {
  const cars = [];
  for (let i = 1; i < num; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  alphaCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;
  carCtx.save();
  carCtx.translate(0, -alphaCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx);
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  alphaCar.draw(carCtx, "alpha");
  carCtx.globalAlpha = 1;
  carCtx.restore();
  networkCtx.lineDashOffset = time / 50;
  Visualizer.drawNetwork(networkCtx, alphaCar.brain);
  requestAnimationFrame(animate);
}
