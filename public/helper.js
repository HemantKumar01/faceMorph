//usage: await wait(5000);
function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
