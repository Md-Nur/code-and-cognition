import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#000000',
        backgroundColor: '#ffffff'
    },
    header: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 10,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    text: {
        marginBottom: 4,
        lineHeight: 1.4,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    label: {
        fontFamily: 'Helvetica-Bold',
        width: 120,
    },
    value: {
        flex: 1,
        lineHeight: 1.4,
    },
    milestonesTable: {
        marginTop: 10,
    },
    milestoneHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
        paddingBottom: 4,
        marginBottom: 8,
        fontFamily: 'Helvetica-Bold',
    },
    milestoneRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        paddingVertical: 6,
    },
    col1: { flex: 3 },
    col2: { flex: 1.5 },
    col3: { flex: 1.5, textAlign: 'right' },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        color: '#666666',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        paddingTop: 10,
    }
});

// Since we pass 'any' for project to avoid circular Prisma type issues in PDF renderers, 
// we will structure it based on the expected included relations.
export function ProjectBriefPDF({ project }: { project: any }) {
    const formatMoney = (amount: number | null | undefined, currency: string) => {
        if (amount == null) return 'N/A';
        return currency === 'BDT' ? `BDT ${amount.toLocaleString()}` : `$${amount.toLocaleString()}`;
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Project Brief: {project.title}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Project Detail</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Client Name:</Text>
                        <Text style={styles.value}>{project.booking?.clientName || 'Direct'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Status:</Text>
                        <Text style={styles.value}>{project.status}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Timeline:</Text>
                        <Text style={styles.value}>
                            {(project.startDate ? format(new Date(project.startDate), 'MMM d, yyyy') : 'TBD')}
                            {' - '}
                            {(project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : 'TBD')}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Budget:</Text>
                        <Text style={styles.value}>
                            {project.booking?.budgetBDT ? formatMoney(project.booking.budgetBDT, 'BDT') : ''}
                            {project.booking?.budgetBDT && project.booking?.budgetUSD ? ' / ' : ''}
                            {project.booking?.budgetUSD ? formatMoney(project.booking.budgetUSD, 'USD') : ''}
                            {(!project.booking?.budgetBDT && !project.booking?.budgetUSD) && 'Not Specified'}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Scope</Text>
                    <Text style={styles.text}>{project.scope || 'No scope defined.'}</Text>
                </View>

                {project.riskNotes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Risk Notes</Text>
                        <Text style={styles.text}>{project.riskNotes}</Text>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Milestones</Text>
                    {project.milestones && project.milestones.length > 0 ? (
                        <View style={styles.milestonesTable}>
                            <View style={styles.milestoneHeader}>
                                <Text style={styles.col1}>Milestone</Text>
                                <Text style={styles.col2}>Status</Text>
                                <Text style={styles.col3}>Completed</Text>
                            </View>
                            {project.milestones.map((milestone: any, index: number) => (
                                <View style={styles.milestoneRow} key={index}>
                                    <Text style={styles.col1}>{milestone.title}</Text>
                                    <Text style={styles.col2}>{String(milestone.status).replace('_', ' ')}</Text>
                                    <Text style={styles.col3}>
                                        {milestone.completedAt ? format(new Date(milestone.completedAt), 'MMM d, yyyy') : '-'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.text}>No milestones defined.</Text>
                    )}
                </View>

                <Text style={styles.footer}>
                    Generated on {format(new Date(), 'MMMM d, yyyy')} | Code & Cognition ERP
                </Text>
            </Page>
        </Document>
    );
}
