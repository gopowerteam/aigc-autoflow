async function toTask1() {

}

async function toTask2() {

}

export async function appLaunch() {
  await Promise.all([
    toTask1(),
    toTask2(),
  ])
}
