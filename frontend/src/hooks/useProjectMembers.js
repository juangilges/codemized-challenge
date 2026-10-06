"use client";

import { useState } from "react";

export default function useProjectMembers({
                                              projectId,
                                              router,
                                              setMessage,
                                          }) {
    const [members, setMembers] = useState([]);
    const [memberEmail, setMemberEmail] = useState("");
    const [addingMember, setAddingMember] = useState(false);

    const setInitialMembers = (membersData) => {
        setMembers(membersData);
    };

    const handleAddMember = async (event) => {
        event.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        if (!memberEmail.trim()) {
            setMessage("Ingresá un email");
            return;
        }

        setAddingMember(true);
        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/members`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        email: memberEmail,
                    }),
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                setMessage(
                    errorData?.message ||
                    "No se pudo agregar el miembro"
                );

                return;
            }

            const newMember =
                await response.json();

            setMembers((currentMembers) => [
                ...currentMembers,
                newMember,
            ]);

            setMemberEmail("");

            setMessage(
                "Miembro agregado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );

        } finally {
            setAddingMember(false);
        }
    };

    const handleRemoveMember = async (
        member
    ) => {
        const confirmed =
            window.confirm(
                `¿Querés quitar a ${member.name} del proyecto?`
            );

        if (!confirmed) {
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            router.push("/");
            return;
        }

        setMessage("");

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/members/${member.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData =
                    await response
                        .json()
                        .catch(() => null);

                setMessage(
                    errorData?.message ||
                    "No se pudo quitar el miembro"
                );

                return;
            }

            setMembers((currentMembers) =>
                currentMembers.filter(
                    (currentMember) =>
                        currentMember.id !== member.id
                )
            );

            setMessage(
                "Miembro eliminado correctamente"
            );

        } catch (error) {
            setMessage(
                "No se pudo conectar con el servidor"
            );
        }
    };

    return {
        members,
        memberEmail,
        setMemberEmail,
        addingMember,
        setInitialMembers,
        handleAddMember,
        handleRemoveMember,
    };
}