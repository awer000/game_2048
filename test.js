document.addEventListener("DOMContentLoaded", function() {
  let grid = gridMake();
  let gridSixOn = false;
  let quick = false;

  // 현재 점수와 최고 점수
  let scoreNumber = 0;
  let bestNumber = Number(localStorage.getItem("best"));

  // DOM 조작을 위한 변수 설정
  const canvas = document.getElementById("test2048");
  const score = document.getElementById("score");
  const bestScore = document.getElementById("bestScore");
  const sixButton = document.getElementById("sixsix");
  const time = document.getElementById("time");

  const d = new Date();
  const ctx = canvas.getContext("2d");

  time.innerHTML = d.setMinutes(3, 0, 0) - d.setMinutes(0, 0, 0);

  const timeOut = setTimeout(() => {
    window.location.reload();
    alert("GAME OVER");
  }, 180000);

  const timer = setInterval(() => {
    if (time.innerHTML > 0) {
      time.innerHTML -= 1000;
    } else {
      clearInterval(timer);
    }
  }, 980);

  // grid 4x4 와 grid 6x6을 반환하는 함수
  function gridMake() {
    return [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  }
  function gridMake66() {
    return [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];
  }
  // 6x6 버튼을 누르면 실행하는 함수.
  function sixStart() {
    time.innerHTML = 180000;
    clearTimeout(timeOut);
    clearInterval(timer);
    setInterval(() => {
      if (time.innerHTML > 0) {
        time.innerHTML -= 1000;
      } else {
        clearInterval(timer);
      }
    }, 980);
    setTimeout(() => {
      //타임 아웃인 경우 66 으로 시작하도록 설정하고 싶다.
      window.location.reload();
      alert("GAME OVER");
    }, 180000);

    gridSixOn = true;
    scoreNumber = 0;
    grid = gridMake66();
    setup();
  }

  // GAME OVER를 체크하는 함수
  function isGameOver() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (grid[i][j] === 0) {
          return false;
        }
        if (i !== grid.length - 1 && grid[i][j] === grid[i + 1][j]) {
          return false;
        }
        if (j !== grid.length - 1 && grid[i][j] === grid[i][j + 1]) {
          return false;
        }
      }
    }
    return true;
  }

  // 페이지 접속하면 실행하는 함수
  function setup() {
    addNumber(); //랜덤 위치에 숫자를 더해주는 함수 2 또는 4
    draw(); // canvas에 도형을 그려주는 함수

    // localStorage 상태를 확인하여 세팅하는 함수
    if (typeof Storage !== undefined) {
      if (!localStorage.getItem("best")) {
        localStorage.setItem("best", 0);
      }
    } else {
      console.log("You can`t use storage");
    }
  }

  function draw() {
    ctx.clearRect(0, 0, 600, 600); // 움직일 때 마다 다시 도형을 그리게 됨
    score.innerHTML = `현재 점수: ${scoreNumber}`;
    bestScore.innerHTML = `최고 점수: ${bestNumber}`;

    if (canvas.getContext) {
      const w = 100;
      addNumber();
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
          ctx.rect(i * w, j * w, 100, 100);
          ctx.stroke();
          if (grid[j][i] !== 0) {
            //0이 아닌 숫자만 도형에 채우도록 하였음.
            ctx.font = "24pt '맑은 고딕'";
            ctx.fillText(grid[j][i], i * w + w / 2, j * w + w / 2); //grid[i][j]를 하면 뿌우아저씨 처럼 세로로 됨.
          }
        }
      }
    }
  }

  // 두 배열을 비교하여 같으면 true를 리턴한다.
  // 배열이 같으면 새 숫자를 생성하지 않도록 하기 위해 만들었다.

  function compare(a, b) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (a[i][j] !== b[i][j]) {
          return true;
        }
      }
    }
    return false;
  }

  // 0이 있는 위치에 랜덤하게 숫자를 생성하는 함수
  function addNumber() {
    let options = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        if (grid[i][j] === 0) {
          options.push({ x: i, y: j });
        }
      }
    }
    if (options.length > 0) {
      const randomSpot = options[Math.floor(Math.random() * options.length)];
      const r = Math.random();
      if (quick) {
        grid[randomSpot.x][randomSpot.y] = r > 0.1 ? 512 : 1024;
      } else {
        grid[randomSpot.x][randomSpot.y] = r > 0.1 ? 2 : 4;
      }
    }
  }

  // 좌우 화살표를 눌렀을때 숫자를 왼쪽이나 오른쪽으로 밀어버리는 함수
  function slide(grid, keycode) {
    let filterZero = grid.filter(value => value);
    let zeros = Array(grid.length - filterZero.length).fill(0);

    if (keycode === 39 || keycode === 40) {
      zeros = zeros.concat(filterZero); // ex [0,2,0,4] => [0,0,2,4]
      return zeros;
    } else if (keycode === 37 || keycode === 38) {
      // ex [0,2,0,4] => [2,4,0,0]
      filterZero = filterZero.concat(zeros);
      return filterZero;
    }
  }

  // 밀고 나서 숫자가 같다면 그 숫자를 더하는 함수
  function plusNumber(grid, keycode) {
    for (let i = grid.length - 1; i >= 1; i--) {
      if (grid[i] === grid[i - 1]) {
        grid[i] = grid[i] + grid[i - 1];
        let bestStart = false;

        // 만약 현재 스코어가 최고 스코어를 경신한다면
        // localStorage에 best를 현재 점수로 다시 세팅하고 bestNumber = scoreNumber로 하여
        // 점수가 같이 올라가게 만든다.
        if (scoreNumber >= bestNumber) {
          localStorage.setItem("best", scoreNumber);
          bestNumber = scoreNumber;
          bestStart = true;
        }
        scoreNumber += grid[i];
        if (bestStart) bestNumber += grid[i];
        grid[i - 1] = 0;
      }
    }

    grid = slide(grid, keycode); // 한번 더 슬라이드 해줌

    return grid;
  }

  // 위 함수와 같으나 전개 방식만 달라짐.
  function plusNumberUp(grid, keycode) {
    for (let i = 0; i < grid.length - 1; i++) {
      if (grid[i] === grid[i + 1]) {
        grid[i] = grid[i] + grid[i + 1];
        let bestStart = false;
        if (scoreNumber >= bestNumber) {
          localStorage.setItem("best", scoreNumber);
          bestNumber = scoreNumber;
          bestStart = true;
        }
        scoreNumber += grid[i];
        if (bestStart) bestNumber += grid[i];
        grid[i + 1] = 0;
      }
    }

    grid = slide(grid, keycode);

    return grid;
  }

  // x,y 축을 바꿈. 위 아래 화살표를 눌렀을 때를 위함
  function upDown() {
    const past = gridSixOn ? gridMake66() : gridMake(); // gridSixOn의 상태에 따라서 어떤 배열을 가지고 오는지 결정
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        past[j][i] = grid[i][j];
      }
    }

    return past;
  }

  // grid를 복사하는 함수.
  function copyGrid(grid) {
    const past = gridSixOn ? gridMake66() : gridMake(); // gridSixOn의 상태에 따라서 어떤 배열을 가지고 오는지 결정
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid.length; j++) {
        past[i][j] = grid[i][j];
      }
    }
    return past;
  }

  // 방향키에 따른 설정
  document.addEventListener("keydown", e => {
    const keycode = e.keyCode;
    let played = true;
    const pastGrid = copyGrid(grid);
    const slideAndPlus = () => {
      for (let i = 0; i < grid.length; i++) {
        grid[i] = slide(grid[i], keycode);
        if (keycode === 38) {
          grid[i] = plusNumberUp(grid[i], keycode);
        } else {
          grid[i] = plusNumber(grid[i], keycode);
        }
      }
    };

    if (keycode === 37 || keycode === 39) {
      slideAndPlus();
    } else if (keycode === 38 || keycode === 40) {
      grid = upDown();
      slideAndPlus();
      grid = upDown();
    } else if (keycode === 81) {
      quick = true; // 치트키 설정
    } else {
      played = false;
    }
    const changed = compare(pastGrid, grid);

    if (played) {
      if (changed) draw(); // 다른 요소가 있다면 draw 함수 호출
      let gameover = isGameOver();
      if (gameover) {
        // 게임 오버가 되면 로컬스토리지에 최고 점수를 기록하고 게임 오버를 알림
        localStorage.setItem("best", bestNumber);
        console.log("GAME OVER");
        alert("GAME OVER");
      }
    }
  });

  sixButton.onclick = function() {
    sixStart();
  };
  setup();
});
