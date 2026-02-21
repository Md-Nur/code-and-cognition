import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Define types for project data
export interface ProjectBriefData {
  title: string;
  clientName: string;
  clientEmail?: string;
  scope?: string;
  startDate?: string;
  endDate?: string;
  budgetBDT?: number;
  budgetUSD?: number;
  riskNotes?: string;
  milestones: Array<{
    title: string;
    description?: string;
    status: string;
    order: number;
  }>;
  createdAt: string;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2 solid #000000",
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#333333",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "bold",
    width: "30%",
    color: "#000000",
  },
  value: {
    fontSize: 11,
    width: "70%",
    color: "#333333",
  },
  milestone: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottom: "1 solid #EEEEEE",
  },
  milestoneTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000000",
  },
  milestoneDescription: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
  },
  milestoneStatus: {
    fontSize: 9,
    color: "#666666",
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#999999",
    borderTop: "1 solid #EEEEEE",
    paddingTop: 10,
  },
});

interface ProjectBriefDocumentProps {
  data: ProjectBriefData;
}

const ProjectBriefDocument: React.FC<ProjectBriefDocumentProps> = ({
  data,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount?: number, currency: "BDT" | "USD" = "BDT") => {
    if (!amount) return "Not specified";
    return currency === "BDT"
      ? `৳${amount.toLocaleString()}`
      : `$${amount.toLocaleString()}`;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PROJECT BRIEF</Text>
          <Text style={styles.subtitle}>{data.title}</Text>
          <Text style={styles.subtitle}>
            Generated on {formatDate(new Date().toISOString())}
          </Text>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Client Name:</Text>
            <Text style={styles.value}>{data.clientName}</Text>
          </View>
          {data.clientEmail && (
            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{data.clientEmail}</Text>
            </View>
          )}
        </View>

        {/* Project Scope */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Scope</Text>
          <Text style={styles.sectionContent}>
            {data.scope || "No scope defined for this project."}
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{formatDate(data.startDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{formatDate(data.endDate)}</Text>
          </View>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          {data.budgetBDT && (
            <View style={styles.row}>
              <Text style={styles.label}>Budget (BDT):</Text>
              <Text style={styles.value}>
                {formatCurrency(data.budgetBDT, "BDT")}
              </Text>
            </View>
          )}
          {data.budgetUSD && (
            <View style={styles.row}>
              <Text style={styles.label}>Budget (USD):</Text>
              <Text style={styles.value}>
                {formatCurrency(data.budgetUSD, "USD")}
              </Text>
            </View>
          )}
          {!data.budgetBDT && !data.budgetUSD && (
            <Text style={styles.sectionContent}>
              Budget information not available.
            </Text>
          )}
        </View>

        {/* Milestones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Milestones</Text>
          {data.milestones.length > 0 ? (
            data.milestones.map((milestone, index) => (
              <View key={index} style={styles.milestone}>
                <Text style={styles.milestoneTitle}>
                  {milestone.order}. {milestone.title}
                </Text>
                {milestone.description && (
                  <Text style={styles.milestoneDescription}>
                    {milestone.description}
                  </Text>
                )}
                <Text style={styles.milestoneStatus}>
                  Status: {milestone.status}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.sectionContent}>
              No milestones defined for this project.
            </Text>
          )}
        </View>

        {/* Risk Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Risk Notes</Text>
          <Text style={styles.sectionContent}>
            {data.riskNotes || "No risk notes documented."}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Project Created: {formatDate(data.createdAt)} | This is a
            confidential document
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ProjectBriefDocument;
