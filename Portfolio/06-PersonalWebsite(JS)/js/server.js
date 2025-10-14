document.addEventListener("DOMContentLoaded", function() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});
var toastEl = document.querySelector('.toast');
  if (toastEl) {
    var toast = new bootstrap.Toast(toastEl);
    toast.show();
}
var scheduleForm = document.getElementById("scheduleForm");
var scheduleTable = document.getElementById("scheduleTable") 
? document.getElementById("scheduleTable").querySelector("tbody")
: null;

scheduleForm.addEventListener("submit", function(e) {
    e.preventDefault();
    var subject = document.getElementById("subject").value;
    var date = document.getElementById("date").value;
    var startTime = document.getElementById("startTime").value;
    var endTime = document.getElementById("endTime").value;
    var location = document.getElementById("location").value;

if (scheduleTable) {
    var newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>${subject}</td>
    <td>${date}</td>
    <td>${startTime}</td>
    <td>${endTime}</td>
    <td>${location}</td>`;
    scheduleTable.appendChild(newRow);
    }
    var modal = new bootstrap.Modal(document.getElementById("scheduleModal"));
    modal.show();
    scheduleForm.reset();
  });
});
