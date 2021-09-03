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

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <i class="far fa-star star">  </i>
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

async function putSubmittedStoryOnPage(evt){
  console.log("putSubmittedStoryOnPage has run")

  evt.preventDefault();
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();

  let newSubmission = await storyList.addStory(currentUser, 
      {author, title, url});
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
function checkFavoritesList(evt){

  let starParentId = evt.target.parentElement.id
  let currStory = storyList.stories.find(story => story.storyId === starParentId)
  console.log("currStory is ", currStory)
  //console.log("starParent", starParent)
  let storyIndex = currentUser.favorites.findIndex(story => story.storyId === currStory.id);
  console.debug("checkFavorites")
  if (storyIndex === -1){
    currentUser.addFavorite(currStory)
    console.log("evt.target is ", evt.target)
    $(evt.target).removeClass("far fa-star star").addClass("fas fa-star star")
  }
  else{
    currentUser.removeFavorite(currStory)
    $(evt.target).removeClass("fas fa-star star").addClass("far fa-star star")
  }
}


$allStoriesList.on("click", ".star", checkFavoritesList)


