async function run() {
  try {
    const res = await fetch('http://localhost:3000');
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.log("Error:", e);
  }
}
run();
