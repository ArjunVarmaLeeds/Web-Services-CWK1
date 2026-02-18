export const parseClashDate = (timeString) => {
    const iso = timeString.replace(
        /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
        "$1-$2-$3T$4:$5:$6"
    );

    return new Date(iso);
};