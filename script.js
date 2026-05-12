const filterButtons = document.querySelectorAll(".filter-btn");
const artCards = document.querySelectorAll(".art-card");
const reserveBtn = document.getElementById("reserveBtn");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    artCards.forEach((card) => {
      const matches =
        selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("hidden", !matches);
    });
  });
});

reserveBtn.addEventListener("click", () => {
  alert("Thanks for your interest. Your gallery visit request has been noted.");
});
