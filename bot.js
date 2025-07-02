const { Telegraf } = require("telegraf");
const fs = require("fs");
const path = "./userStats.json";

const bot = new Telegraf(process.env.BOT_TOKEN); // Read token from env
const todayUsers = new Set();

if (!fs.existsSync(path)) fs.writeFileSync(path, "{}");

// Handle all messages
bot.on("message", (ctx) => {
  const userId = ctx.from.id;
  const today = new Date().toISOString().split("T")[0];

  if (!todayUsers.has(userId)) {
    todayUsers.add(userId);

    const stats = JSON.parse(fs.readFileSync(path));
    stats[today] = (stats[today] || 0) + 1;
    fs.writeFileSync(path, JSON.stringify(stats, null, 2));
  }

  ctx.reply("✅ You are now counted for today!");
});

// /stats command
bot.command("stats", (ctx) => {
  const today = new Date().toISOString().split("T")[0];
  const stats = JSON.parse(fs.readFileSync(path));
  const count = stats[today] || 0;
  ctx.reply(`👥 Unique users today: ${count}`);
});

bot.launch();
console.log("🚀 Bot is running...");
