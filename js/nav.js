"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $favStoriesList.hide();
  $submitForm.hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navSubmit.show();
  $navFavorites.show();
}

/** Show submit form for a new story when a user clicks submit  */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

/** When "favorites" is clicked in the nav bar, show list of favorite articles
 * and hide all others */
function navFavoritesClick(evt){
  $allStoriesList.hide();
  $submitForm.hide();
  hidePageComponents();
  getAndShowFavorites();
  $favStoriesList.show();     //TO DO move to inside getAndShow
}

$navFavorites.on("click", navFavoritesClick);


