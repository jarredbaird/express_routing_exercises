const express = require("express");
const ExpressError = require("./expressError");

const app = express();

app.get("/mean", function (request, response, next) {
  try {
    if (!request.query.nums) {
      throw new ExpressError("nums are required", 400);
    }
  } catch (err) {
    return next(err);
  }
  let nums = request.query.nums.split(",");
  try {
    nums.forEach((x) => {
      if (isNaN(parseInt(x))) {
        throw new ExpressError("NaN!!!", 400);
      }
    });
  } catch (err) {
    return next(err);
  }
  let intNums = nums.map((x) => (isNaN(parseInt(x)) ? undefined : parseInt(x)));
  for (num in intNums) {
    console.log(num);
    if (!num) {
      console.log("error found!!!");
      throw new ExpressError("NaN!!!", 400);
    }
  }

  console.log(intNums);
  let sum = intNums.reduce(function (accum, cur) {
    accum = cur + accum;
    return accum;
  });
  return response.json({ operation: "mean", value: sum / intNums.length });
});

app.get("/median", function (request, response) {
  let median;
  try {
    if (!request.query.nums) {
      throw new ExpressError("nums are required", 400);
    }
  } catch (err) {
    return next(err);
  }
  let nums = request.query.nums.split(",");
  try {
    nums.forEach((x) => {
      if (isNaN(parseInt(x))) {
        throw new ExpressError("NaN!!!", 400);
      }
    });
  } catch (err) {
    return next(err);
  }
  let intNums = new Int16Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    intNums[i] = parseInt(nums[i]);
  }
  intNums.sort();
  console.log(`intNums: ${intNums}`);
  console.log(`intNums.length % 2: ${intNums.length % 2}`);
  if (!(intNums.length % 2)) {
    // if even
    let secondHalf = Math.floor(intNums.length / 2);
    let firstHalf = secondHalf - 1;
    console.log(
      `intNums[firstHalf]: ${intNums[firstHalf]}`,
      `intNums[secondHalf]: ${intNums[secondHalf]}`
    );
    median = (intNums[firstHalf] + intNums[secondHalf]) / 2;
    console.log(`Median: ${median}`);
  } else {
    // if odd
    median = intNums[intNums.length / 2 - 1];
  }
  return response.json({ operation: "median", value: median });
});

app.get("/mode", function (request, response) {
  try {
    if (!request.query.nums) {
      throw new ExpressError("nums are required", 400);
    }
  } catch (err) {
    return next(err);
  }
  let nums = request.query.nums.split(",");
  try {
    nums.forEach((x) => {
      if (isNaN(parseInt(x))) {
        throw new ExpressError("NaN!!!", 400);
      }
    });
  } catch (err) {
    return next(err);
  }
  let intNums = nums.map((x) => parseInt(x));
  let countMap = intNums.reduce(function (accum, cur, index, array) {
    if (cur in accum) {
      accum[cur]++;
    } else {
      accum[cur] = 1;
    }
    return accum;
  }, {});
  console.log(countMap);
  let maxValue = Math.max.apply(null, Object.values(countMap));
  let modeArray = [];
  for (val in countMap) {
    if (countMap[val] === maxValue) {
      modeArray.push(val);
    }
  }
  console.log(modeArray);
  return response.json({ operation: "mode", value: modeArray });
});

app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, function () {
  console.log("App on port 3000");
});
