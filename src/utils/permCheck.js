const { PermissionsBitField } = require('discord.js');

function checkUserPermissions(member, permissions = []) {
  if (!member || permissions.length === 0) return { has: true, missing: [] };
  const missing = permissions.filter(p => !member.permissions.has(p));
  return { has: missing.length === 0, missing };
}

function checkBotPermissions(guild, permissions = []) {
  if (!guild || permissions.length === 0) return { has: true, missing: [] };
  const me = guild.members.me;
  if (!me) return { has: false, missing: permissions };
  const missing = permissions.filter(p => !me.permissions.has(p));
  return { has: missing.length === 0, missing };
}

function formatPermissions(perms = []) {
  const readable = new PermissionsBitField(perms).toArray();
  return readable.map(p => `\`${p}\``).join(', ') || 'None';
}

function isAbove(executor, target) {
  if (!executor || !target) return false;
  if (executor.id === executor.guild.ownerId) return true;
  if (target.id === target.guild.ownerId) return false;
  return executor.roles.highest.position > target.roles.highest.position;
}

function canModerate(executor, target, botMember) {
  if (!isAbove(executor, target)) return { can: false, reason: 'Target has higher or equal role.' };
  if (botMember && !isAbove(botMember, target)) return { can: false, reason: 'Bot role is lower than target.' };
  return { can: true, reason: null };
}

module.exports = {
  checkUserPermissions,
  checkBotPermissions,
  formatPermissions,
  isAbove,
  canModerate,
};
