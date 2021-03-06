
## Map requirements

### Layers
- events
- overlay
- details
- background

## Scraping charas project:

http://www.charas-project.net/charas2/res_viewer.php?sk=1522036800&img=119

## Converting RPG maker 2000 chipset do tiled

```
npm run assets:tilesets src/raw/tilesets/interior.png data/maps/tilesets/interior.png
```

## Splitting RPG maker 2000 character set
```
convert character.png -crop 24x32 character-%02d.png
convert test.png -transparent white transparent.png
```

## Font

Size is 8, font minecraftia
Generate using hiero then use:

```
perl src/tools/fnt2xml.pl src/assets/fonts/main.fnt
```

Characters
```
ABCDEFGHIJKLMNOPQRSTUVWXYZŁŃĆŚŻŹÓĄĘ
abcdefghijklmnopqrstuvwxyzłńćśżźóąę
1234567890
"!`?'.,;:()[]{}<>|/@\^$-%+=#_&~* 
```

## Fetching characters templates

```
npm run assets:charsets:fetch
npm run assets:charsets:extract
npm run assets:facesets:extract
```

## Developing

Build protobuff stuff
```
npm run build:protocol
```

Run web server
```
npm run dev:server
```

Run webpack dev server
```
npm run dev:webpack
```

Open in chrome browser `chrome://inspect`

## Message format

* First byte - id of serializer
* rest bytes handle by deserializer

## Resources

* Tileset - https://opengameart.org/content/zelda-like-tilesets-and-sprites
* Cursors - http://www.cursors-4u.com/mmorpg/
* Examples - http://labs.phaser.io/
* MongoDB - https://mongodb.github.io/node-mongodb-native/3.0/tutorials/crud/
* Docs - https://photonstorm.github.io/phaser3-docs/list_class.html

## Events

Create file in `data/events` with extension `.yaml`

```YAML
pages:
  - state:
      charset: &oldman static/people1/5 #oldman
      direction: down
      blocking: true
      trigger: Click
    actions:
      - type: message
        message:
          text: |
            Multiline:
            message!
      - type: switch # change state of switch
        key: *quest_switch
        state: true
  - state: # this page accesible is only if switch is on
      charset: *oldman # charset
      direction: right # direction
      blocking: true # can player walk
      trigger: Click # type of trigger Click|Touch
    conditions:
      - type: switch # can have miltiple conditions
        key: *quest_switch
        state: true
    actions:
      - type: message
        message:
          text: Example single line message

```

### Quest state

- started
- completed
- closed
