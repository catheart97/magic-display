<p align="center">
    <img src="public/logo.png" style="height:10rem" />
</p>

# Magic Display

A web application designed to run locally on your machine to create a info display for your D&D players. It provides an admin view with display adjustment options and a quick reference using data from [5eTools](https://5e.tools/).

<p align="center">
    <img src="public/demo.png" />
</p>

## Getting Started

First, install dependencies, followed by preparing the _database_:

```bash
npm install
npm run db
```

Afterwards you can test the environment using:

```bash
npm run dev
```

You should now be able to access the following pages:

- Dungeon Master's Page or Admin Page [http://localhost:3000/admin](http://localhost:3000/admin) (The default password is `admin`)
- Display Page [http://localhost:3000/](http://localhost:3000/)
- Quick Compendium for Druid Beasts and Spells [http://localhost:3000/compendium](http://localhost:3000/compendium)
- Print Pages for Spells (incomplete), Druid Beasts and Player Sidekick NPCs (from [Falindrith's Monster Maker](https://ebshimizu.github.io/5emm/#/)):
  - [http://localhost:3000/print/spells](http://localhost:3000/print/spells)
  - [http://localhost:3000/print/druid-cards](http://localhost:3000/print/druid-cards)
  - [http://localhost:3000/print/npc/[NPC-ID-NUMBER]](http://localhost:3000/print/npc/[NPC-ID-NUMBER])

## Customize the Screen

Per default there are two campaigns in the data directory. Each containing various files. The most interesting part is the `meta.json` file as it gives the application information about your current campaign. The diashow folder contains all images that will be displayed on the screen.

The calendar used to display day-time should be compatible with the [Fantasy Calendar](https://fantasy-calendar.com/) json. Sidekick NPCs follow the Schema from [Falindrith's Monster Maker](https://ebshimizu.github.io/5emm/#/).

More information on how to style (might) follow.

## Implementation Notices / Contributions

This project is still in development and **contains** bugs. I already use it for my campaign `Dracaiya` and will therefore continue to improve it. I usually run the App on my MacBook Air (M1) and use it with Safari or Chrome.

The App contains partial Type Annotations for the [5eTools](https://5e.tools/) database, these are mostly written by hand and therefore might be faulty or incomplete. Same holds for the [Fantasy Calendar](https://fantasy-calendar.com/) type annotations.

If you want to contribute, feel free to open a pull request.

## AI-Disclaimer

Almost all images from the demo campaigns are AI-generated. Except for the character images itself. These images I drew myself.
