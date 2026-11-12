import React, { useState } from "react";
import { Image, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { COLORS } from "../constants/categories";
function getImage(item) {
    const a = [
        item?.imageUrl,
        item?.image_url,
        item?.image?.url,
        item?.image,
        item?.wiki?.imageUrl,
        item?.wiki?.image,
        item?.artworkUrl,
    ];
    return a.find((v) => typeof v === "string" && v.startsWith("https://"));
}
export default function ArchiveCard({
    title,
    subtitle,
    item,
    icon = "◇",
    onPress,
}) {
    const [failed, setFailed] = useState(false);
    const image = getImage(item);
    return (
        <Card
            onPress={onPress}
            mode="outlined"
            style={{
                backgroundColor: COLORS.panel,
                borderColor: COLORS.line,
                marginBottom: 12,
                borderRadius: 8,
            }}
        >
            <Card.Title
                title={title}
                subtitle={subtitle || ""}
                titleStyle={{
                    color: COLORS.white,
                    fontFamily: "Cinzel_700Bold",
                    fontSize: 15,
                }}
                subtitleStyle={{ color: COLORS.muted, fontSize: 12 }}
                left={() => (
                    <View
                        style={{
                            width: 58,
                            height: 62,
                            marginLeft: 12,
                            borderWidth: 1,
                            borderColor: COLORS.line,
                            borderRadius: 5,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: COLORS.background,
                            overflow: "hidden",
                        }}
                    >
                        {image && !failed ? (
                            <Image
                                source={{ uri: image }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="contain"
                                onError={() => setFailed(true)}
                            />
                        ) : (
                            <Text style={{ color: COLORS.glow, fontSize: 27 }}>{icon}</Text>
                        )}
                    </View>
                )}
                right={() => (
                    <Text style={{ color: COLORS.glow, fontSize: 25, marginRight: 14 }}>
                        ›
                    </Text>
                )}
            />
        </Card>
    );
}
