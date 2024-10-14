import tickets from "../../models/Tickets.js";
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } from "discord.js";

export default class Transcript extends Interaction {
    constructor() {
        super({
            name: "transcript",
            description: "Saves the ticket's transcript",
        });
    }

    async exec(int, data) {

        let channel = int.channel;
        let isMod = data.modRoles.some((r) => int.member._roles.includes(r));

        if (!isMod && !int.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return int.reply({
                content: "You don't have permission to do that!",
                ephemeral: true,
            });
        }

        let ticket = await tickets.findOne({ ticketID: channel.id });
        if (!ticket) {
            return int.reply({
                content: "This is not a ticket!",
                ephemeral: true,
            });
        }

        int.reply({
            content: "Saving transcript...",
        });

        int.channel.messages.fetch().then(async (messages) => {
            let transcript = messages
                .filter((m) => m.author.bot !== true)
                .map(
                    (m) =>
                        `${new Date(m.createdTimestamp).toLocaleString("en-GB")} - ${
                            m.author.username
                        }#${m.author.discriminator}: ${
                            m.attachments.size > 0
                                ? m.content + m.attachments.first().proxyURL
                                : m.content
                        }`
                )
                .reverse()
                .join("\n");

            if (transcript.length < 1) transcript = "No messages sent";

            const pastebinData = new URLSearchParams({
                api_dev_key: process.env.PASTEBIN_API_KEY,
                api_option: "paste",
                api_paste_code: transcript,
                api_paste_private: "1",
                api_paste_name: `Transcript for ${channel.name}`,
                api_paste_expire_date: "1W",
            });

            try {
                const response = await fetch("https://pastebin.com/api/api_post.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: pastebinData,
                });

                const pasteUrl = await response.text();

                let row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel("View transcript")
                        .setURL(pasteUrl)
                        .setStyle(ButtonStyle.Link)
                );

                await int.editReply({
                    content: "Transcript saved!",
                    components: [row],
                });

                if (data.transcriptChannel) {
                    let emb = new EmbedBuilder()
                        .setDescription(`📰 Transcript of the ticket \`${int.channel.id}\` opened by <@!${ticket._id}>`)
                        .setColor("#2f3136")
                        .setTimestamp();

                    let transcriptChannel = await int.guild.channels.fetch(data.transcriptChannel);
                    transcriptChannel.send({
                        embeds: [emb],
                        components: [row],
                    });
                }

                if (data.logsChannel) {
                    let owner = await int.guild.members.fetch(ticket._id);
                    let log = new EmbedBuilder()
                        .setTitle("Ticket transcript saved")
                        .addFields([
                            { name: "Moderator", value: `${int.user}`, inline: true },
                            { name: "Ticket", value: `${int.channel.id}`, inline: true },
                            { name: "Opened by", value: `${owner}`, inline: true },
                        ])
                        .setColor("#3ccffa")
                        .setTimestamp();

                    let logsChannel = await int.guild.channels.fetch(data.logsChannel);
                    logsChannel.send({ embeds: [log], components: [row] });
                }

            } catch (error) {
                console.error("Error uploading transcript to Pastebin:", error);
                await int.editReply({
                    content: "Failed to save the transcript. Please try again later.",
                });
            }
        });
    }
};
