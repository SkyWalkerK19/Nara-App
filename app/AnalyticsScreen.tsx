// nara-app/app/AnalyticsScreen.tsx
import { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { loadStudentAnalytics } from '../lib/analyticsApi'

export default function AnalyticsScreen() {
  const [kpi, setKpi] = useState<any>(null)
  const [byYear, setByYear] = useState<any[]>([])
  const [byMajor, setByMajor] = useState<any[]>([])

  useEffect(() => {
    loadStudentAnalytics().then(({ kpi, byYear, byMajor }) => {
      setKpi(kpi)
      setByYear(byYear || [])
      setByMajor(byMajor || [])
    })
  }, [])

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
        Student Analytics
      </Text>

      {kpi && (
        <Text style={{ fontSize: 16, marginBottom: 20 }}>
          Total Students: {kpi.total_students}
        </Text>
      )}

      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>
        By Graduation Year
      </Text>
      <FlatList
        data={byYear}
        keyExtractor={(item) => item.grad_year.toString()}
        renderItem={({ item }) => (
          <Text>{item.grad_year}: {item.n_students}</Text>
        )}
      />

      <Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 8 }}>
        By Major
      </Text>
      <FlatList
        data={byMajor}
        keyExtractor={(item) => item.major}
        renderItem={({ item }) => (
          <Text>{item.major}: {item.n_students}</Text>
        )}
      />
    </View>
  )
}
