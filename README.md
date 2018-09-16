\*\*

# Lance Massey

**Google UXE Exercise: Infinitely Scrolling List**

_Installation:_

1.  cd ./<wherever you put the code base>
2.  yarn install
3.  cd ./frontend
4.  yarn install
5.  yarn start
6.  open localhost:3000 in your browser

_Basic info:_

Though I've been working in React Native for the past two years, I thought this exercise would be more interesting in "normal" react. I ejected from a "create-react-app" boilerplate then added redux, redux-persist, redux-sagas, redux-undo, rxjs, and styled components to fill out the missing bits, and modified the structure so that it's more modular.

Initially, I tried just loading everything into a single scrolling list which worked OK for rendering, but got seriously bogged down when trying to swipe components, so I went for a virtualized list. I'd wanted to write my own, but time constraints didn't allow for that, so I opted for "react-tiny-virtual-list" and with a couple of tweaks it worked quite well.

Even though the only animation mentioned was the swipe, the UX didn't feel complete without a deletion animation. I also added a "touch start" animation so people would know they could do something, and since I also added undo capability, I had to add an undo animation - otherwise it was just nasty...

BTW: I also opted for a single level of undo, since it's a simple add-on with redux undo.

_Issues:_
The first issue was that the messages site threw CORS errors - not nice! So I had to put together a proxy server and toss it up on heroku. If there are any performance issues it'll most likely be because the server fell asleep.

Second was dealing with the browser sorting through thousands of elements to track the mousedowns for the swipes. Once I went virtual though, that solved it self.

Third... **_variable card heights_** in a virtual list in a responsive web app that works on Pixel 2 **and** iPhone. Ouch... Anyway - once I'd figured out a rough way to calculate the number of lines, I created a "lineHeight" variable and passed it around to the card. It's a little hacky, and if I had more time I think I could do better.

Fourth - making it responsive without much in the way of guidelines. Mostly I worked the widths based on a per centage - the guide was 360px width, the margins were 14px, so I used 92% width as a baseline. Vertical dimensions I kept at absolute pixels which seems to translate nicely between devices.

And the specs that I got were pretty vague - no mention of what to do with the hamburger menu, or whether or not cards should expand to a detail view expand inline, or if there should be an undo. I eventually opted for undo and the detail view as it just looked prettier.

_Explanation of code:_

Everything applicable is in: `/frontend/src/modules/Home` the rest is the boilerplate I've put together over the past little while. Of particular interest to the project is, of course the `index.js` file, but the heavy lifting (for the animations) is in `./components/swipeableCard.js`

I've tried to simplify the code as much as possible, but the use of observables and timeouts sometimes makes it tricky to follow. The gist for updating the list is that scroll events are throttled using an edge detection function to act like both a gate and a diode so it only refreshes when scrolling down and not back up and no faster than the throttle time in order to not flood neither the list nor the network.

Swipes are a little more complicated due to the animations and the fact that I felt compelled to add undo capability. I'll keep this short:

A mousedown immediately tells the module which card is being swiped (swipingIndex) and starts the "touchdown" animation, at which point the react-easy-swipe module comes into play tracking the X location. The X value is sent to the card container which uses a CSS translation style property to move it around accordingly. If the X location is past 30% of the card's width the delete sequence is started, an improvement would be a velocity tracker so a quick swipe at the top would also trigger the delete function.

The deletion sequence first starts the deletion animation (scale XYZ and opacity to nothingness) then calls redux to remove the item from the messages array. During this time the animation will have completed and a state change is called to re-render the list as the card quickly fades in - this is what makes it feel like the list is "bumping up"

Finally, for undo the undo animation is started, and once complete the item is added back into the app state where it reappears on screen.

Aaaaaand.... that's about it really. Pretty simple, lots of fun, buttery smooth. Hope you like it!

Wait until I add the sound effects. :)

BTW: There are some tests, but those were more for my own sanity checks than anything else.
