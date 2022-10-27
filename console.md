

# 参考资料

1. ANSI转义序列入门：  [(7条消息) ANSI转义序列详解_ScilogyHunter的博客-CSDN博客_ansi 转义序列](https://blog.csdn.net/ScilogyHunter/article/details/106874395)
2. wiki：  [ANSI escape code - Wikipedia](https://en.wikipedia.org/wiki/ANSI_escape_code#OSC_(Operating_System_Command)_sequences)
3. 国际标准：  ISO 6429
4. 字符集标准：  ECMA-48
5. linux-0.11 console源码： 《linux内核完全注释》

# 名词解释

- escape：  转义
- DC：  Device Control， 用来控制设备的开启和关闭
- CSI： Control Sequence Introducer， 控制序列导入器
- OSC： Operating System Command，操作系统指令







## ASCII 控制字符

指的是ASCII码表开头的32个字符以及字符DEL，后面96个是ASCII打印字符

终端 (控制) 代码是用来控制终端的特殊命令，它可以改变颜色和光标的位置。  终端解析字符时会直接执行而不会打印出来，可以分为通讯控制，格式控制，信息分隔符三类

- CC： Communication Control
- FE： Format Effector
- IS： Information Separator



| 十进制 | Hex  | Symbol | Type | Ctrl | 转义 | 解释                                                         |
| ------ | ---- | ------ | ---- | ---- | ---- | ------------------------------------------------------------ |
| 0      | 00   | NUL    |      | ^@   | \0   | NULL                                                         |
| 1      | 01   | SOH    | CC   | ^A   |      | Start of Heading                                             |
| 2      | 02   | STX    | CC   | ^B   |      | Start of Text                                                |
| 3      | 03   | ETX    | CC   | ^C   |      | End of Text                                                  |
| 4      | 04   | EOT    | CC   | ^D   |      | End of Transmission                                          |
| 5      | 05   | ENQ    | CC   | ^E   |      | Enquiry（查询）                                              |
| 6      | 06   | ACK    | CC   | ^F   |      | Acknowledge                                                  |
| 7      | 07   | BEL    |      | ^G   | \a   | Bell                                                         |
| 8      | 08   | BS     | FE   | ^H   | \b   | Backspace                                                    |
| 9      | 09   | HT     | FE   | ^I   | \t   | Horizontal Tabulation                                        |
| 10     | 0A   | LF     | FE   | ^J   | \n   | Line Feed(换行)                                              |
| 11     | 0B   | VT     | FE   | ^K   | \v   | Vertical Tabulation                                          |
| 12     | 0C   | FF     | FE   | ^L   | \f   | Form Feed(换页)                                              |
| 13     | 0D   | CR     | FE   | ^M   | \r   | Carriage return(回车)                                        |
| 14     | 0E   | SO     |      | ^N   |      | Shift Out(移出)                                              |
| 15     | 0F   | SI     |      | ^O   |      | Shift In                                                     |
| 16     | 10   | DLE    | CC   | ^P   |      | Data Link Escape(数据链路转义)                               |
| 17     | 11   | DC1    |      | ^Q   |      | Device Control 1(XON)                                        |
| 18     | 12   | DC2    |      | ^R   |      | Device Control 2                                             |
| 19     | 13   | DC3    |      | ^S   |      | Device Control 3(XOFF)                                       |
| 20     | 14   | DC4    |      | ^T   |      | Device Control 4                                             |
| 21     | 15   | NAK    | CC   | ^U   |      | Negative Acknowledge                                         |
| 22     | 16   | SYN    | CC   | ^V   |      | Synchronous Idle                                             |
| 23     | 17   | ETB    | CC   | ^W   |      | End of Transmission Block                                    |
| 24     | 18   | CAN    |      | ^X   |      | Cancel                                                       |
| 25     | 19   | EM     |      | ^Y   |      | End of Medium                                                |
| 26     | 1A   | SUB    |      | ^Z   |      | Substitute                                                   |
| 27     | 1B   | ESC    |      | ^[   | \e   | Escape(溢出，后面可以加颜色代码)<br />Invokes a control sequence |
| 28     | 1C   | FS     | IS   | ^\   |      | File Separator                                               |
| 29     | 1D   | GS     |      | ^]   |      | Group Separator                                              |
| 30     | 1E   | RS     |      | ^^   |      | Record Separator                                             |
| 31     | 1F   | US     |      | ^-   |      | Unit Separator                                               |



## ANSI 转义序列

由于控制字符太少，远远不够用来控制终端的各种属性，因此发明出使用转义序列来控制终端属性的方法。

但是序列有很多种，包括C0序列，C1序列，CSI序列，SGR序列，OSC序列等等

### C0 序列

单字符构成，常用的如下

| [^](https://en.wikipedia.org/wiki/Caret_notation) |  C0  | Abbr |      Name       |                            Effect                            |
| :-----------------------------------------------: | :--: | :--: | :-------------: | :----------------------------------------------------------: |
|                        ^G                         |  7   | BEL  |      Bell       |                   Makes an audible noise.                    |
|                        ^H                         |  8   |  BS  |    Backspace    | Moves the cursor left (but may "backwards wrap" if cursor is at start of line). |
|                        ^I                         |  9   |  HT  |       Tab       |        Moves the cursor right to next multiple of 8.         |
|                        ^J                         | 0x0A |  LF  |    Line Feed    | Moves to next line, scrolls the display up if at bottom of the screen. Usually does not move horizontally, though programs should not rely on this. |
|                        ^L                         | 0x0C |  FF  |    Form Feed    | Move a printer to top of next page. Usually does not move horizontally, though programs should not rely on this. Effect on video terminals varies. |
|                        ^M                         | 0x0D |  CR  | Carriage Return |               Moves the cursor to column zero.               |
|                        ^[                         | 0x1B | ESC  |     Escape      |               Starts all the escape sequences                |

### Fe 序列

也叫C1序列，ESC后续跟一个字节，范围是0x40 to 0x5F。有些设备会将其映射到一个字节，0x8E~0x9F，但UTF-8编码设备仍保留两字节。

| 序列      | 2 Bytes    | C1       | Abbr    | 名称                                                    |
| --------- | ---------- | -------- | ------- | ------------------------------------------------------- |
| ESC N     | 0x1B4E     | 0x8e     | SS2     | SS2 – Single Shift Two                                  |
| ESC O     | 0x1B4F     | 0x8f     | SS3     | SS3 – Single Shift Three                                |
| ESC P     | 0x1B50     | 0x90     | DCS     | DCS – 设备控制字符串（Device Control String）           |
| **ESC [** | **0x1B5B** | **0x9b** | **CSI** | **CSI - 控制序列导入器（Control Sequence Introducer）** |
| ESC \     | 0x1B5C     | 0x9c     | ST      | ST – 字符串终止（String Terminator）                    |
| **ESC ]** | **0x1B5D** | **0x9d** | **OSC** | **OSC – 操作系统命令（Operating System Command）**      |
| ESC X     | 0x1B58     | 0x98     | SOS     | SOS – 字符串开始（Start of String）                     |
| ESC ^     | 0x1B5E     | 0x9e     | PM      | PM – 私有消息（Privacy Message）                        |
| ESC _     | 0x1B5F     | 0x9f     | APC     | APC – 应用程序命令（Application Program Command）       |

### ESC- but not CSI-sequences 

非控制转义序列

| 序列              | 缩写                                 | 说明                                                         |
| ----------------- | ------------------------------------ | ------------------------------------------------------------ |
| ESC c             | RIS                                  | 重绘屏幕.                                                    |
| ESC D             | IND                                  | 换行.                                                        |
| ESC E             | NEL                                  | 新的一行.（new line）                                        |
| ESC H             | HTS                                  | 设置当前列为制表位.                                          |
| ESC M             | RI                                   | 翻转换行(Reverse linefeed).                                  |
| ESC Z             | DECID                                | DEC 私有定义.内核将其解释为                                  |
|                   |                                      | VT102字符,返回字符ESC [ ? 6 c.                               |
| ESC 7             | DECSC                                | 存储当前状态(光标坐标,                                       |
|                   |                                      | 属性,字符集).                                                |
| ESC 8             | DECRC                                | 恢复上一次储存的设置                                         |
| ESC [             | CSI                                  | 控制序列介绍                                                 |
| ESC %             |                                      | 开始一个字符集选择序列                                       |
| ESC % @           | 选择默认字符集(ISO 646 / ISO 8859-1) |                                                              |
| ESC % G           |                                      | 选择 UTF-8                                                   |
| ESC % 8           |                                      | 选择 UTF-8(已不用)                                           |
| ESC # 8           | DECALN                               | DEC 屏幕校准测试 - 以E's填充屏幕.                            |
| ESC(              |                                      | 开始一个 G0 字符集定义序列                                   |
| ESC( B            |                                      | 选择默认字符集(ISO 8859-1 mapping)                           |
| ESC( 0            |                                      | 选择 vt100 图形映射                                          |
| ESC( U            |                                      | 选择空映射 - 直接访问字符ROM                                 |
| ESC( K            |                                      | 选择用户映射 - 由程序**mapscrn**(8)加载.                     |
| ESC )             |                                      | 开始一个 G1 字符集定义(后面跟 B,0,U,K,同上).                 |
| ESC >             | DECPNM                               | 设置数字小键盘模式                                           |
| ESC =             | DECPAM                               | 设置程序键盘模式                                             |
| ESC ]             | OSC                                  | (是operating system command的缩写)                           |
| ESC ] P *nrrggbb* |                                      | 设置调色板,后面紧跟7个十六进制数,再跟一个 P :-(. 这里 *n* 是颜色(0-16),而 *rrggbb* 表示 红/绿/蓝 值(0-255). |
| ESC ] R           |                                      | 重置调色板                                                   |

### CSI 序列

由四部分构成

1. CSI： Control Sequence Introducer 控制序列导入器， ESC+[
2. parameter bytes:  若干参数字节，范围 0x30-0x3F(ASCII `0–9:;<=>?`)
3. intermediate bytes: 若干中间字节， 范围 0x20–0x2F (ASCII space and `!"#$%&'()*+,-./`)
4. final byte: 一个终止字节， 范围 0x40–0x7E (ASCII `@A–Z[\]^_`a–z{|}~`)

| 组成部分 | 字符范围  | ASCII                 |
| -------- | --------- | --------------------- |
| 参数字节 | 0x30–0x3F | 0–9:;<=>?             |
| 中间字节 | 0x20–0x2F | 空格、!"#$%&’()*+,-./ |
| 最终字节 | 0x40–0x7E | @A–Z[]^_`a–z{         |

一些常用的序列及其含义

|    Code     | Abbr |                             Name                             |                            Effect                            |
| :---------: | :--: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|   CSI n A   | CUU  |                          Cursor Up                           | Moves the cursor n (default `1`) cells in the given direction. If the cursor is already at the edge of the screen, this has no effect. |
|   CSI n B   | CUD  |                         Cursor Down                          |                                                              |
|   CSI n C   | CUF  |                        Cursor Forward                        |                                                              |
|   CSI n D   | CUB  |                         Cursor Back                          |                                                              |
|   CSI n E   | CNL  |                       Cursor Next Line                       | Moves cursor to beginning of the line n (default `1`) lines down. (not [ANSI.SYS](https://en.wikipedia.org/wiki/ANSI.SYS)) |
|   CSI n F   | CPL  |                     Cursor Previous Line                     | Moves cursor to beginning of the line n (default `1`) lines up. (not [ANSI.SYS](https://en.wikipedia.org/wiki/ANSI.SYS)) |
|   CSI n G   | CHA  |                  Cursor Horizontal Absolute                  | Moves the cursor to column n (default `1`). (not [ANSI.SYS](https://en.wikipedia.org/wiki/ANSI.SYS)) |
| CSI n ; m H | CUP  |                       Cursor Position                        | Moves the cursor to row n, column m. The values are 1-based, and default to `1` (top left corner) if omitted. A sequence such as `CSI ;5H` is a synonym for `CSI 1;5H` as well as `CSI 17;H` is the same as `CSI 17H` and `CSI 17;1H` |
|   CSI n J   |  ED  |                       Erase in Display                       | Clears part of the screen. If n is `0` (or missing), clear from cursor to end of screen. If n is `1`, clear from cursor to beginning of the screen. If n is `2`, clear entire screen (and moves cursor to upper left on DOS [ANSI.SYS](https://en.wikipedia.org/wiki/ANSI.SYS)). If n is `3`, clear entire screen and delete all lines saved in the scrollback buffer (this feature was added for [xterm](https://en.wikipedia.org/wiki/Xterm) and is supported by other terminal applications). |
|   CSI n K   |  EL  |                        Erase in Line                         | Erases part of the line. If n is `0` (or missing), clear from cursor to the end of the line. If n is `1`, clear from cursor to beginning of the line. If n is `2`, clear entire line. Cursor position does not change. |
|   CSI n S   |  SU  |                          Scroll Up                           | Scroll whole page up by n (default `1`) lines. New lines are added at the bottom. (not [ANSI.SYS](https://en.wikipedia.org/wiki/ANSI.SYS)) |
|   CSI n T   |  SD  |                         Scroll Down                          | Scroll whole page down by n (default `1`) lines. New lines are added at the top. (not [ANSI.SYS](https://en.wikipedia.org/wiki/ANSI.SYS)) |
| CSI n ; m f | HVP  |                 Horizontal Vertical Position                 | Same as CUP, but counts as a format effector function (like [CR](https://en.wikipedia.org/wiki/Carriage_return) or [LF](https://en.wikipedia.org/wiki/Line_feed)) rather than an editor function (like CUD or CNL). This can lead to different handling in certain terminal modes.[[5\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-ECMA-48-5): Annex A |
|   CSI n m   | SGR  | [Select Graphic Rendition](https://en.wikipedia.org/wiki/ANSI_escape_code#SGR) | Sets colors and style of the characters following this code  |
|   CSI 5i    |      |                         AUX Port On                          |   Enable aux serial port usually for local serial printer    |
|   CSI 4i    |      |                         AUX Port Off                         |   Disable aux serial port usually for local serial printer   |
|   CSI 6n    | DSR  |                     Device Status Report                     | Reports the cursor position (CPR) by transmitting `ESC[n;mR`, where n is the row and m is the column. |

一部分字符定义是“私有”的，以便终端制造商可以插入他们自己的序列而不与标准相冲突。下面是一些常见的私有序列

|     Code     |    Abbr    |             Name              |                            Effect                            |
| :----------: | :--------: | :---------------------------: | :----------------------------------------------------------: |
|    CSI s     | SCP, SCOSC | Save Current Cursor Position  | Saves the cursor position/state in SCO console mode.[[31\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-32) In vertical split screen mode, instead used to set (as `CSI n ; n s`) or reset left and right margins.[[32\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-33) |
|    CSI u     | RCP, SCORC | Restore Saved Cursor Position | Restores the cursor position/state in SCO console mode.[[33\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-34) |
|  CSI ? 25 h  |  DECTCEM   |                               | Shows the cursor, from the [VT220](https://en.wikipedia.org/wiki/VT220). |
|  CSI ? 25 l  |  DECTCEM   |                               |                      Hides the cursor.                       |
| CSI ? 1049 h |            |                               |         Enable alternative screen buffer, from xterm         |
| CSI ? 1049 l |            |                               |        Disable alternative screen buffer, from xterm         |
| CSI ? 2004 h |            |                               | Turn on bracketed paste mode.[[34\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-35) In bracketed paste mode, text pasted into the terminal will be surrounded by `ESC [200~` and `ESC [201~`; programs running in the terminal should not treat characters bracketed by those sequences as commands ([Vim](https://en.wikipedia.org/wiki/Vim_(text_editor)), for example, does not treat them as commands).[[35\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-36) From xterm[[36\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-37) |
| CSI ? 2004 l |            |                               |                Turn off bracketed paste mode.                |

### SGR 序列

SGR全程为Select Graphic Rendition， 字符渲染指令，是CSI的一个子集。格式为`CSI n m`，以数字开头，并以 m 结尾，n 的取值范围是 0-107。又可以分成两类，一类控制字符显示样式，另一类控制显示颜色。每个指令起作用后一直有效，知道碰到另一个SGR。CSI m 表示 CSI 0 m， 表示常规模式或者重置指令。

下面是SGR参数列表，其中30-49设置颜色比较常用

|   *n*   |                             Name                             |                             Note                             |
| :-----: | :----------------------------------------------------------: | :----------------------------------------------------------: |
|    0    |                      Reset *or* normal                       |                      All attributes off                      |
|    1    |                 Bold or increased intensity                  | As with faint, the color change is a PC (SCO / [CGA](https://en.wikipedia.org/wiki/Color_Graphics_Adapter)) invention.[[38\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-SCO-39)[*[better source needed](https://en.wikipedia.org/wiki/Wikipedia:NOTRS)*] |
|    2    |             Faint, decreased intensity, *or* dim             | May be implemented as a light [font weight](https://en.wikipedia.org/wiki/Font_weight) like bold.[[39\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-40) |
|    3    |                            Italic                            | Not widely supported. Sometimes treated as inverse or blink.[[38\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-SCO-39) |
|    4    |                          Underline                           | Style extensions exist for Kitty, VTE, mintty and iTerm2.[[40\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-color-u-41)[[41\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-color-u-kitty-spec-42) |
|    5    |                          Slow blink                          |       Sets blinking to less than 150 times per minute        |
|    6    |                         Rapid blink                          |    MS-DOS ANSI.SYS, 150+ per minute; not widely supported    |
|    7    | [Reverse video](https://en.wikipedia.org/wiki/Reverse_video) *or* invert | Swap foreground and background colors; inconsistent emulation[[42\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-console-termio-realize-43) |
|    8    |                      Conceal *or* hide                       |                    Not widely supported.                     |
|    9    | [Crossed-out](https://en.wikipedia.org/wiki/Strikethrough), *or* strike | Characters legible but marked as if for deletion. Not supported in Terminal.app |
|   10    |                    Primary (default) font                    |                                                              |
|  11–19  |                       Alternative font                       |               Select alternative font *n* − 10               |
|   20    |  [Fraktur](https://en.wikipedia.org/wiki/Fraktur) (Gothic)   |                       Rarely supported                       |
|   21    |               Doubly underlined; or: not bold                | Double-underline per ECMA-48,[[5\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-ECMA-48-5): 8.3.117  but instead disables bold intensity on several terminals, including in the [Linux kernel](https://en.wikipedia.org/wiki/Linux_kernel)'s [console](https://en.wikipedia.org/wiki/Linux_console) before version 4.17.[[43\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-44) |
|   22    |                       Normal intensity                       | Neither bold nor faint; color changes where intensity is implemented as such. |
|   23    |               Neither italic, nor blackletter                |                                                              |
|   24    |                        Not underlined                        |             Neither singly nor doubly underlined             |
|   25    |                         Not blinking                         |                      Turn blinking off                       |
|   26    |                     Proportional spacing                     | [ITU T.61](https://en.wikipedia.org/wiki/ITU_T.61) and T.416, not known to be used on terminals |
|   27    |                         Not reversed                         |                                                              |
|   28    |                            Reveal                            |                        Not concealed                         |
|   29    |                       Not crossed out                        |                                                              |
|  30–37  | Set foreground [color](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) |                                                              |
|   38    | Set foreground [color](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) | [Next arguments are `5;n` or `2;r;g;b`](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) |
|   39    |                   Default foreground color                   |        Implementation defined (according to standard)        |
|  40–47  | Set background [color](https://en.wikipedia.org/wiki/ANSI_escape_code#3-bit_and_4-bit) |                                                              |
|   48    | Set background [color](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) | [Next arguments are `5;n` or `2;r;g;b`](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) |
|   49    |                   Default background color                   |        Implementation defined (according to standard)        |
|   50    |                 Disable proportional spacing                 |                        T.61 and T.416                        |
|   51    |                            Framed                            | Implemented as "[emoji variation selector](https://en.wikipedia.org/wiki/Variation_Selectors_(Unicode_block))" in mintty.[[44\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-mintty-45) |
|   52    |                          Encircled                           |                                                              |
|   53    |                          Overlined                           |                Not supported in Terminal.app                 |
|   54    |                 Neither framed nor encircled                 |                                                              |
|   55    |                        Not overlined                         |                                                              |
|   58    | Set underline [color](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit) | Not in standard; implemented in Kitty, VTE, mintty, and iTerm2.[[40\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-color-u-41)[[41\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-color-u-kitty-spec-42) [Next arguments are `5;n` or `2;r;g;b`](https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit). |
|   59    |                   Default underline color                    | Not in standard; implemented in Kitty, VTE, mintty, and iTerm2.[[40\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-color-u-41)[[41\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-color-u-kitty-spec-42) |
|   60    |            Ideogram underline or right side line             |                       Rarely supported                       |
|   61    | Ideogram double underline, *or* double line on the right side |                                                              |
|   62    |             Ideogram overline or left side line              |                                                              |
|   63    | Ideogram double overline, *or* double line on the left side  |                                                              |
|   64    |                   Ideogram stress marking                    |                                                              |
|   65    |                    No ideogram attributes                    |            Reset the effects of all of `60`–`64`             |
|   73    |                         Superscript                          | Implemented only in mintty[[44\](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-mintty-45) |
|   74    |                          Subscript                           |                                                              |
|   75    |              Neither superscript nor subscript               |                                                              |
|  90–97  |                 Set bright foreground color                  | Not in standard; originally implemented by aixterm[[29\]](https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-xtc-30) |
| 100–107 |                 Set bright background color                  |                                                              |

对于颜色设置，根据颜色位数不同，有不同的参数。常用的有3/4位色，8位色，24位色。

基本的颜色配置参数如下

|  FG  |  BG  |        Name         |
| :--: | :--: | :-----------------: |
|  30  |  40  |        Black        |
|  31  |  41  |         Red         |
|  32  |  42  |        Green        |
|  33  |  43  |       Yellow        |
|  34  |  44  |        Blue         |
|  35  |  45  |       Magenta       |
|  36  |  46  |        Cyan         |
|  37  |  47  |        White        |
|  90  | 100  | Bright Black (Gray) |
|  91  | 101  |     Bright Red      |
|  92  | 102  |    Bright Green     |
|  93  | 103  |    Bright Yellow    |
|  94  | 104  |     Bright Blue     |
|  95  | 105  |   Bright Magenta    |
|  96  | 106  |     Bright Cyan     |
|  97  | 107  |    Bright White     |

#### 示例

```bash
<0x1B>[01;32mubuntu@ubuntu20
# 表示的是 加粗（01），蓝色（32）
ESC [ 0 ; 4 ; 7 m
# CSI： ESC [,  表示控制序列导入器
# 选择参数： 0， 4， 7，  分别表示取消所有字符属性， 开启下划线， 反显属性
# 分隔符： ；
# 终止符： m
```

注意此处0x1B必须被<>包裹，不然无法显示，会被转义。



### OSC 序列

由于一些历史原因，ST序列（ESC\）和BEL序列(0x07)均可以表示结束指令

#### 示例

```bash
<0x1B>]0;32mubuntu@ubuntu20: ~/test/scriptReplay<0x07>
#  <0x1B>]0  <0x07> 包裹了操作系统指令，表示这一行字符串是操作系统直接显示的，而不是交互输入或输出的字符串
```













