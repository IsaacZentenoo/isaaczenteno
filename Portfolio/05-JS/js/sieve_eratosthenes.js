/*
    Sieve of Eratosthenes - The sieve of Eratosthenes is one of the most efficient ways
    to find all of the smaller primes (below 10 million or so).
*/

// TODO: Adjust this script so it can work with the sieve.html file.

var sieve = function (n) {
  "use strict";
  var array = [],
    primes = [],
    i,
    j;

  // TODO: Implement the sieve of eratosthenes algorithm to find all the prime numbers under the given number.
array = new Array(n + 1).fill(true);
array[0] = array[1] = false;

for (i = 2; i * i <= n; i++) {
  if (array[i]) {
    for (j = i * i; j <= n; j += i) {
      array[j] = false;
    }
  }
}

for (i = 2; i <= n; i++) {
  if (array[i]) {
    primes.push(i);
  }
}
  return primes;
};
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("btn");
  const input = document.getElementById("num");
  const primesContainer = document.getElementById("primes");  
  btn.addEventListener("click", function() {
    const n = parseInt(input.value);
    if (isNaN(n) || n < 2) {
      primesContainer.textContent = "Please enter a number greater than 1.";
      return;
    }
    const primes = sieve(n);
    primesContainer.textContent = primes.join(", ");
  });
});

