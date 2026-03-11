package com.covianhive.student_loan_system_backend.persistence.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Converter(autoApply = false)
public class LocalDateTimeSqliteConverter implements AttributeConverter<LocalDateTime, String> {

    private static final DateTimeFormatter DB_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    private static final DateTimeFormatter LEGACY_SPACE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public String convertToDatabaseColumn(LocalDateTime attribute) {
        return attribute == null ? null : DB_FORMAT.format(attribute);
    }

    @Override
    public LocalDateTime convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }

        if (dbData.chars().allMatch(Character::isDigit)) {
            long epochMillis = Long.parseLong(dbData);
            return LocalDateTime.ofInstant(Instant.ofEpochMilli(epochMillis), ZoneOffset.UTC);
        }

        try {
            return LocalDateTime.parse(dbData, DB_FORMAT);
        } catch (DateTimeParseException ignored) {
            // Fallback for older rows stored with a space separator.
        }

        return LocalDateTime.parse(dbData, LEGACY_SPACE_FORMAT);
    }
}
