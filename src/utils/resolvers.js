function resolveMember(message, input) {
  if (!input) return null;
  const guild = message.guild;
  if (!guild) return null;

  const mention = input.match(/^<@!?(\d+)>$/);
  if (mention) return guild.members.cache.get(mention[1]) || null;

  if (/^\d{17,19}$/.test(input)) return guild.members.cache.get(input) || null;

  const lowered = input.toLowerCase();
  return guild.members.cache.find(m =>
    m.user.username.toLowerCase() === lowered ||
    m.user.tag.toLowerCase() === lowered ||
    (m.nickname && m.nickname.toLowerCase() === lowered)
  ) || null;
}

function resolveUser(client, input) {
  if (!input) return null;

  const mention = input.match(/^<@!?(\d+)>$/);
  if (mention) return client.users.cache.get(mention[1]) || null;

  if (/^\d{17,19}$/.test(input)) return client.users.cache.get(input) || null;

  const lowered = input.toLowerCase();
  return client.users.cache.find(u => u.username.toLowerCase() === lowered || u.tag.toLowerCase() === lowered) || null;
}

function resolveChannel(guild, input) {
  if (!input || !guild) return null;

  const mention = input.match(/^<#(\d+)>$/);
  if (mention) return guild.channels.cache.get(mention[1]) || null;

  if (/^\d{17,19}$/.test(input)) return guild.channels.cache.get(input) || null;

  const lowered = input.toLowerCase();
  return guild.channels.cache.find(c => c.name.toLowerCase() === lowered) || null;
}

function resolveRole(guild, input) {
  if (!input || !guild) return null;

  const mention = input.match(/^<@&(\d+)>$/);
  if (mention) return guild.roles.cache.get(mention[1]) || null;

  if (/^\d{17,19}$/.test(input)) return guild.roles.cache.get(input) || null;

  const lowered = input.toLowerCase();
  return guild.roles.cache.find(r => r.name.toLowerCase() === lowered) || null;
}

async function fetchMember(guild, userId) {
  try {
    return await guild.members.fetch(userId);
  } catch (_) {
    return null;
  }
}

async function fetchUser(client, userId) {
  try {
    return await client.users.fetch(userId);
  } catch (_) {
    return null;
  }
}

module.exports = {
  resolveMember,
  resolveUser,
  resolveChannel,
  resolveRole,
  fetchMember,
  fetchUser,
};
