"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  // (currentUser.favorites.filter(favorite => {
  // console.log("favorite.storyId is ", favorite.storyId)
  // console.log("story.storyId is ", story.storyId)
  // favorite.storyId === story.storyId}))
  //const storyId = story.storyId
  const storyIndex = currentUser.favorites.findIndex(favorite => favorite.storyId === story.storyId)
  let starStyle;

  if (storyIndex === -1) {
    starStyle = "far"
  }
  else {
    starStyle = "fas"         /// build small helper function to check favorite
  }

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="${starStyle} fa-star star">  </i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Takes in the user submission values and appends to the page */

async function putSubmittedStoryOnPage(evt) {
  console.log("putSubmittedStoryOnPage has run")

  evt.preventDefault();
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();

  let newSubmission = await storyList.addStory(currentUser,
    { author, title, url });
  const $story = generateStoryMarkup(newSubmission);
  $allStoriesList.prepend($story);

  $submitForm.hide();
}

$submitForm.on("submit", putSubmittedStoryOnPage);


/**   When user clicks on a favorite star, checks if the story exists
*     in the favorites list.
*     if not --> adds story
*     if yes --> removes story
*/
async function checkFavoritesList(evt) { // toggles favorite story

  const starParentId = evt.target.parentElement.id;   //should be jQuery
  const currStory = storyList.stories.find(story => story.storyId === starParentId);
  const clickedStoryId = currStory.storyId;
  const storyIndex = currentUser.favorites.findIndex(story => story.storyId === clickedStoryId);

  if (storyIndex === -1) {
    await currentUser.addFavorite(currStory)
  }
  else {
    await currentUser.removeFavorite(currStory)
  }
  $(evt.target).toggleClass("fas far");
}
//stories container
$storiesContainer.on("click", ".star", checkFavoritesList)

/** Adding favorite stories to the HTML
 */

function getAndShowFavorites() {

  $favStoriesList.empty();

  // loop through all of our favorite stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoriesList.append($story);
  }
}

