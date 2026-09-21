import express from "express";
import cors from "cors";
import "dotenv/config";
import { Resend } from "resend";

import { initializeDatabase, saveProposal } from "./database";

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok",
        message: "Backend de FloresMitul funcionando 🌷",
    });
});

app.post("/api/proposals", async (req, res) => {
    try {
        const proposalData = req.body;

        console.log("Nueva propuesta:");
        console.log(proposalData);

        const proposalId = await saveProposal(proposalData);

        const { data: emailData, error: emailError } = await resend.emails.send({
            from: "FloresMitul <onboarding@resend.dev>",
            to: [process.env.NOTIFICATION_EMAIL!],
            subject: "¡Cita Agendada!",
            html: `
                <h1>¡Se ha agendado la cita!</h1>

                <p>Alguien acaba de completar la planeación de cita.</p>

                <hr />

                <h2>Detalles de la propuesta</h2>

                <p>
                    <strong>Flor:</strong>
                    ${proposalData.flower}
                </p>

                <p>
                    <strong>Fecha:</strong>
                    ${proposalData.date}
                </p>

                <p>
                    <strong>Hora:</strong>
                    ${proposalData.time}
                </p>

                <p>
                    <strong>Momento del día:</strong>
                    ${proposalData.timeOfDay}
                </p>

                <p>
                    <strong>Actividad:</strong>
                    ${proposalData.activity}
                </p>

                <p>
                    <strong>Comida favorita:</strong>
                    ${proposalData.favoriteFood}
                </p>

                <p>
                    <strong>Comida que no le gusta:</strong>
                    ${proposalData.dislikedFood}
                </p>

                <p>
                    <strong>Lugar favorito:</strong>
                    ${proposalData.favoritePlace}
                </p>

                <p>
                    <strong>Plan seleccionado:</strong>
                    ${proposalData.selectedPlan}
                </p>

                <p>
                    <strong>Cosas que quiere evitar:</strong>
                    ${proposalData.thingsToAvoid}
                </p>

                <p>
                    <strong>Otra idea:</strong>
                    ${proposalData.otherIdea}
                </p>

                <p>
                    <strong>Mensaje adicional:</strong>
                    ${proposalData.additionalMessage}
                </p>

                <hr />

                <p>
                    💌 ID de propuesta: ${proposalId}
                </p>
            `
        });

        if (emailError) {
            console.error("La propuesta se guardó, pero el correo falló:");
            console.error(emailError);

            res.status(201).json({
                message: "Propuesta guardada, pero no se pudo enviar el correo.",
                proposalId,
                emailSent: false,
            });

            return;
        }

        res.status(201).json({
            message: "Propuesta guardada y notificación enviada 🌷",
            proposalId,
            emailSent: true,
        });
    } catch (error) {
        console.error("Error procesando la propuesta:", error);

        res.status(500).json({
            message: "No se pudo guardar la propuesta",
        });
    }
});

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `Backend ejecutándose en http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error(
            "Error al inicializar la base de datos:",
            error
        );
    });