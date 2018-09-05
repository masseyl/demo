\*\*

# Lance Massey

**Google UXE Exercise: Infinitely Scrolling List**

_Basic info:_
Though I've been working in React Native for the past two years, I thought this exercise would be more interesting in "normal" react. I ejected from a "create-react-app" boilerplate then added redux, redux-persist, redux-sagas, redux-undo, and styled components to fill out the missing bits, and modified the structure so that it's more modular.

Initially, I tried just loading everything into a single scrolling list which worked OK for rendering, but got seriously bogged down when trying to swipe components, so I went for a virtualized list. I'd wanted to write my own, but time constraints didn't allow for that, so I opted for "react-tiny-virtual-list" and with a couple of tweaks it worked quite well.

Since the only animation mentioned was for the swipe action, I opted for basic CSS3d transitions - no keyframes, just some timers so that the list re-render feels like it's "bumping up" after the card has disappeared.

I also opted for a single level of undo, since it's a simple add-on with redux undo.

_Issues:_
The first issue was that the messages site threw CORS errors - not nice! So I had to put together a proxy server and toss it up on heroku. If there are any performance issues it'll most likely be because the server fell asleep.

After that it was dealing with the browser sorting through thousands of elements to track the mousedowns for the swipes. Once I went virtual though, that solved it self.

And the specs that I got were pretty vague with no colors, no mention of what to do with the hamburger menu, or whether or not cards should expand to a detail view when clicked or expand inline. I eventually opted for the detail view as it just looked prettier.

_Explanation of code:_

Everything applicable is in: `/frontend/src/modules/Home` the rest is the boilerplate I've put together over the past little while. Of particular interest to the project is, of course the `index.js` file, but the heavy lifting (for the animations) is in `./components/swipeableCard.js`

I've tried to simplify the code as much as possible, but the use of throttles and timeouts sometimes makes it tricky to follow. The gist for updating the list is that scroll events are throttled using a comparison function to act like both a gate and a diode so it only refreshes when scrolling down and not back up and no faster than the throttle time in order to not flood neither the list nor the network.

Swipes are a little more complicated due to the animations and the fact that I felt compelled to add undo capability. I'll keep this short:

A mousedown immediately tell the module which card is being swiped (swipingIndex) at which point the react-easy-swipe module comes into play tracking the X location. The X value is sent to the card container which uses a CSS translation property to move it around accordingly. A simple velocity calculation is also applied and if the velocity over a given amount, or the X location is past 30% of the card's width the delete sequence is started.

The deletion sequence first starts the deletion animation (scale XYZ and opacity to nothingness) then calls redux to remove the item from the messages array. During this time the animation will have completed and a state change is called to re-render the list as the card quickly fades in - this is what makes it feel like the list is "bumping up"

Aaaaaand.... that's about it really. Pretty simple, lots of fun, buttery smooth. Hope you like it!

Wait until I add the sound effects. :)

BTW: There are some tests, but those were more for my own sanity checks than anything else.
