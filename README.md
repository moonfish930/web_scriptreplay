# web_scriptreplay

## Description
A web script replay project written in javascript. This project is a combination of two resources below, thanks for the jobs they have done. 

1. [ysangkok/terminal_web_player: scriptreplay in the browser. Save your terminal window content and replay it on your website. (github.com)](https://github.com/ysangkok/terminal_web_player)
2. [scriptreplay in javascript (mister-muffin.de)](https://mister-muffin.de/scriptreplay/)

## Software Architecture
### src files

- term.js:  implement a terminal in web, from  https://raw.github.com/chjj/tty.js/d379c6f9/static/term.js
- view.html:  main entrance 
- view.js:   implement functional logic

### script files

- outFile.out:  typescript_data
- timeSeq.out:  timing_data

## How to use

1.  Open project in vscode, open view.html, right click and click "Open with Live Server"(you should install a "Live Server" extension first).
2.  On the web page, click "Choose File" on the right of "typescript", select "outFile.out"; then click "Choose File" on the right of "timingfile", select "timeSeq.out".
3.  Click "play" and then enjoy.

## Instructions

1. Play control provides "play", "pause", "resume", "stop" functions.

2. Output property provides speed control

3. How to make script files in linux:

   ```bash
   script -a outFile.out -t 2>timeSeq.out
   # type some commmand
   # type exit
   # then you will get 2 files: outFile.out and timeSeq.out
   ```

   How to use scriptreplay in linux:

   ```bash
   scriptreplay -t timeSeq.out -s outFile.out
   ```

   More details: [scriptreplay command in Linux with Examples - GeeksforGeeks](https://www.geeksforgeeks.org/scriptreplay-command-in-linux-with-examples/)

4. If you know Chinese and want to dive into console details, you can refer to console.md

## Contribution

1.  Fork the repository
2.  Create Feat_xxx branch
3.  Commit your code
4.  Create Pull Request

